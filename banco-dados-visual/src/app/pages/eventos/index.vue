<script setup lang="ts">
import type { EventoComBeneficiario } from '~/types/database'
import type { TableColumn } from '@nuxt/ui'
import { formatDateTime } from '~/utils/format'

const { items, loading, fetchAll, remove } = useEventos()
const { items: beneficiarios, fetchAll: fetchBeneficiarios } = useBeneficiarios()

const search = ref('')
const modalOpen = ref(false)
const selected = ref<EventoComBeneficiario | null>(null)

await Promise.all([fetchAll(), fetchBeneficiarios()])

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return items.value
  return items.value.filter(e =>
    [e.nome_evento, e.descricao_evento, e.beneficiario?.nome, e.beneficiario?.regiao]
      .filter(Boolean)
      .some(v => String(v).toLowerCase().includes(q))
  )
})

const columns: TableColumn<EventoComBeneficiario>[] = [
  { accessorKey: 'nome_evento', header: 'Evento' },
  { accessorKey: 'beneficiario', header: 'Beneficiário' },
  { accessorKey: 'data_hora_inicio', header: 'Início' },
  { accessorKey: 'data_hora_fim', header: 'Fim' },
  { id: 'actions', header: 'Ações' }
]

function openCreate() {
  selected.value = null
  modalOpen.value = true
}

function openEdit(row: EventoComBeneficiario) {
  selected.value = row
  modalOpen.value = true
}

async function confirmDelete(row: EventoComBeneficiario) {
  const ok = window.confirm(`Excluir o evento "${row.nome_evento || row.id}"?`)
  if (!ok) return
  await remove(row.id)
}

function statusEvento(row: EventoComBeneficiario) {
  if (!row.data_hora_inicio) return { label: 'Sem data', color: 'neutral' as const }
  const start = new Date(row.data_hora_inicio).getTime()
  const end = row.data_hora_fim ? new Date(row.data_hora_fim).getTime() : start
  const now = Date.now()
  if (now < start) return { label: 'Planejado', color: 'info' as const }
  if (now > end) return { label: 'Concluído', color: 'success' as const }
  return { label: 'Em andamento', color: 'warning' as const }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p class="text-sm text-muted">
          Planeje eventos e vincule beneficiários para manter o histórico de participação.
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <UInput
          v-model="search"
          icon="i-lucide-search"
          placeholder="Buscar eventos..."
          class="w-64"
        />
        <UButton
          icon="i-lucide-refresh-cw"
          color="neutral"
          variant="outline"
          :loading="loading"
          @click="fetchAll()"
        />
        <UButton
          icon="i-lucide-plus"
          @click="openCreate"
        >
          Novo evento
        </UButton>
      </div>
    </div>

    <UCard :ui="{ body: 'p-0 sm:p-0' }">
      <UTable
        :data="filtered"
        :columns="columns"
        :loading="loading"
        class="w-full"
      >
        <template #nome_evento-cell="{ row }">
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <p class="font-medium text-highlighted">
                {{ row.original.nome_evento || '—' }}
              </p>
              <UBadge
                :color="statusEvento(row.original).color"
                variant="subtle"
                size="sm"
              >
                {{ statusEvento(row.original).label }}
              </UBadge>
            </div>
            <p
              v-if="row.original.descricao_evento"
              class="mt-0.5 line-clamp-1 text-xs text-muted"
            >
              {{ row.original.descricao_evento }}
            </p>
          </div>
        </template>

        <template #beneficiario-cell="{ row }">
          <div v-if="row.original.beneficiario">
            <p class="text-highlighted">
              {{ row.original.beneficiario.nome }}
            </p>
            <p
              v-if="row.original.beneficiario.regiao"
              class="text-xs text-muted"
            >
              {{ row.original.beneficiario.regiao }}
            </p>
          </div>
          <span
            v-else
            class="text-muted"
          >—</span>
        </template>

        <template #data_hora_inicio-cell="{ row }">
          {{ formatDateTime(row.original.data_hora_inicio) }}
        </template>

        <template #data_hora_fim-cell="{ row }">
          {{ formatDateTime(row.original.data_hora_fim) }}
        </template>

        <template #actions-cell="{ row }">
          <div class="flex justify-end gap-1">
            <UButton
              icon="i-lucide-pencil"
              color="neutral"
              variant="ghost"
              size="sm"
              aria-label="Editar"
              @click="openEdit(row.original)"
            />
            <UButton
              icon="i-lucide-trash-2"
              color="error"
              variant="ghost"
              size="sm"
              aria-label="Excluir"
              @click="confirmDelete(row.original)"
            />
          </div>
        </template>
      </UTable>

      <div
        v-if="!loading && !filtered.length"
        class="border-t border-default px-4 py-8 text-center text-sm text-muted"
      >
        Nenhum evento encontrado.
      </div>
    </UCard>

    <EventoFormModal
      v-model:open="modalOpen"
      :evento="selected"
      :beneficiarios="beneficiarios"
      @saved="fetchAll()"
    />
  </div>
</template>
