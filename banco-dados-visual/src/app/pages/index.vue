<script setup lang="ts">
import { formatDateTime } from '~/utils/format'

const { items: beneficiarios, loading: loadingBenef, fetchAll: fetchBeneficiarios } = useBeneficiarios()
const { items: eventos, loading: loadingEventos, fetchAll: fetchEventos } = useEventos()

const loading = computed(() => loadingBenef.value || loadingEventos.value)

await Promise.all([fetchBeneficiarios(), fetchEventos()])

const totalBeneficiarios = computed(() => beneficiarios.value.length)
const totalEventos = computed(() => eventos.value.length)

const eventosProximos = computed(() => {
  const now = Date.now()
  return eventos.value
    .filter(e => e.data_hora_inicio && new Date(e.data_hora_inicio).getTime() >= now)
    .slice(0, 5)
})

const eventosSemBeneficiario = computed(() =>
  eventos.value.filter(e => !e.beneficiario_id).length
)

const porRegiao = computed(() => {
  const map = new Map<string, number>()
  for (const b of beneficiarios.value) {
    const key = b.regiao?.trim() || 'Não informada'
    map.set(key, (map.get(key) ?? 0) + 1)
  }
  return [...map.entries()]
    .map(([regiao, total]) => ({ regiao, total }))
    .sort((a, b) => b.total - a.total)
})

const maxRegiao = computed(() => Math.max(1, ...porRegiao.value.map(r => r.total)))

const recentes = computed(() => eventos.value.slice(0, 6))

async function refresh() {
  await Promise.all([fetchBeneficiarios(), fetchEventos()])
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold text-highlighted">
          Visão geral
        </h1>
        <p class="text-sm text-muted">
          Painel da ONG Vida Plena — beneficiários, eventos e participação.
        </p>
      </div>
      <div class="flex gap-2">
        <UButton
          icon="i-lucide-refresh-cw"
          color="neutral"
          variant="outline"
          :loading="loading"
          @click="refresh"
        >
          Atualizar
        </UButton>
        <UButton
          icon="i-lucide-users"
          to="/beneficiarios"
          variant="soft"
        >
          Beneficiários
        </UButton>
        <UButton
          icon="i-lucide-calendar-plus"
          to="/eventos"
        >
          Eventos
        </UButton>
      </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        title="Beneficiários"
        :value="totalBeneficiarios"
        icon="i-lucide-users"
        description="Cadastros ativos"
      />
      <StatsCard
        title="Eventos"
        :value="totalEventos"
        icon="i-lucide-calendar-days"
        color="info"
        description="Planejados no sistema"
      />
      <StatsCard
        title="Próximos"
        :value="eventosProximos.length"
        icon="i-lucide-clock-3"
        color="warning"
        description="Com data futura"
      />
      <StatsCard
        title="Sem vínculo"
        :value="eventosSemBeneficiario"
        icon="i-lucide-user-x"
        color="neutral"
        description="Eventos sem beneficiário"
      />
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between gap-2">
            <h2 class="font-semibold text-highlighted">
              Beneficiários por região
            </h2>
            <UBadge
              color="neutral"
              variant="subtle"
            >
              {{ porRegiao.length }} regiões
            </UBadge>
          </div>
        </template>

        <div
          v-if="!porRegiao.length"
          class="py-8 text-center text-sm text-muted"
        >
          Cadastre beneficiários para ver a distribuição.
        </div>

        <ul
          v-else
          class="space-y-3"
        >
          <li
            v-for="item in porRegiao"
            :key="item.regiao"
          >
            <div class="mb-1 flex items-center justify-between text-sm">
              <span class="text-highlighted">{{ item.regiao }}</span>
              <span class="text-muted">{{ item.total }}</span>
            </div>
            <div class="h-2 overflow-hidden rounded-full bg-muted">
              <div
                class="h-full rounded-full bg-primary"
                :style="{ width: `${(item.total / maxRegiao) * 100}%` }"
              />
            </div>
          </li>
        </ul>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between gap-2">
            <h2 class="font-semibold text-highlighted">
              Próximos eventos
            </h2>
            <UButton
              to="/eventos"
              size="sm"
              color="neutral"
              variant="ghost"
              trailing-icon="i-lucide-arrow-right"
            >
              Ver todos
            </UButton>
          </div>
        </template>

        <div
          v-if="!eventosProximos.length"
          class="py-8 text-center text-sm text-muted"
        >
          Nenhum evento futuro cadastrado.
        </div>

        <ul
          v-else
          class="divide-y divide-default"
        >
          <li
            v-for="evento in eventosProximos"
            :key="evento.id"
            class="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0"
          >
            <div class="min-w-0">
              <p class="truncate font-medium text-highlighted">
                {{ evento.nome_evento || 'Sem nome' }}
              </p>
              <p class="text-xs text-muted">
                {{ evento.beneficiario?.nome || 'Sem beneficiário' }}
              </p>
            </div>
            <span class="shrink-0 text-xs text-muted">
              {{ formatDateTime(evento.data_hora_inicio) }}
            </span>
          </li>
        </ul>
      </UCard>
    </div>

    <UCard>
      <template #header>
        <h2 class="font-semibold text-highlighted">
          Eventos recentes
        </h2>
      </template>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[640px] text-left text-sm">
          <thead class="border-b border-default text-muted">
            <tr>
              <th class="pb-3 font-medium">Evento</th>
              <th class="pb-3 font-medium">Beneficiário</th>
              <th class="pb-3 font-medium">Início</th>
              <th class="pb-3 font-medium">Fim</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td
                colspan="4"
                class="py-8 text-center text-muted"
              >
                Carregando...
              </td>
            </tr>
            <tr v-else-if="!recentes.length">
              <td
                colspan="4"
                class="py-8 text-center text-muted"
              >
                Nenhum evento cadastrado ainda.
              </td>
            </tr>
            <tr
              v-for="evento in recentes"
              :key="evento.id"
              class="border-b border-default/60 last:border-0"
            >
              <td class="py-3 pr-3">
                <p class="font-medium text-highlighted">
                  {{ evento.nome_evento || '—' }}
                </p>
                <p
                  v-if="evento.descricao_evento"
                  class="line-clamp-1 text-xs text-muted"
                >
                  {{ evento.descricao_evento }}
                </p>
              </td>
              <td class="py-3 pr-3 text-muted">
                {{ evento.beneficiario?.nome || '—' }}
              </td>
              <td class="py-3 pr-3 text-muted">
                {{ formatDateTime(evento.data_hora_inicio) }}
              </td>
              <td class="py-3 text-muted">
                {{ formatDateTime(evento.data_hora_fim) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UCard>
  </div>
</template>
