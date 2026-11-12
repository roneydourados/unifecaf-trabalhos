<script setup lang="ts">
import type { Beneficiario, Evento } from '~/types/database'
import { formatDateTime } from '~/utils/format'

const props = defineProps<{
  open: boolean
  beneficiario?: Beneficiario | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const { fetchByBeneficiario } = useEventos()
const loading = ref(false)
const historico = ref<Evento[]>([])

watch(() => props.open, async (isOpen) => {
  if (!isOpen || !props.beneficiario) return
  loading.value = true
  historico.value = await fetchByBeneficiario(props.beneficiario.id)
  loading.value = false
})
</script>

<template>
  <UModal
    :open="open"
    :title="`Histórico · ${beneficiario?.nome ?? ''}`"
    description="Eventos em que este beneficiário está inscrito."
    @update:open="emit('update:open', $event)"
  >
    <template #body>
      <div
        v-if="loading"
        class="flex justify-center py-8"
      >
        <UIcon
          name="i-lucide-loader-circle"
          class="size-6 animate-spin text-muted"
        />
      </div>

      <div
        v-else-if="!historico.length"
        class="rounded-lg border border-dashed border-default px-4 py-8 text-center text-sm text-muted"
      >
        Nenhum evento vinculado a este beneficiário.
      </div>

      <ul
        v-else
        class="space-y-3"
      >
        <li
          v-for="evento in historico"
          :key="evento.id"
          class="rounded-lg border border-default p-3"
        >
          <p class="font-medium text-highlighted">
            {{ evento.nome_evento || 'Evento sem nome' }}
          </p>
          <p
            v-if="evento.descricao_evento"
            class="mt-1 text-sm text-muted"
          >
            {{ evento.descricao_evento }}
          </p>
          <p class="mt-2 text-xs text-muted">
            {{ formatDateTime(evento.data_hora_inicio) }}
            →
            {{ formatDateTime(evento.data_hora_fim) }}
          </p>
        </li>
      </ul>
    </template>
  </UModal>
</template>
