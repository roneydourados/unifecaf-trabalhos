<script setup lang="ts">
import type { Beneficiario, EventoComBeneficiario } from '~/types/database'
import { formatDateInput, toTimestamp } from '~/utils/format'

const props = defineProps<{
  open: boolean
  evento?: EventoComBeneficiario | null
  beneficiarios: Beneficiario[]
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  saved: []
}>()

const { create, update } = useEventos()
const saving = ref(false)

const form = reactive({
  nome_evento: '',
  descricao_evento: '',
  data_hora_inicio: '',
  data_hora_fim: '',
  beneficiario_id: undefined as number | undefined
})

watch(() => props.open, (isOpen) => {
  if (!isOpen) return
  form.nome_evento = props.evento?.nome_evento ?? ''
  form.descricao_evento = props.evento?.descricao_evento ?? ''
  form.data_hora_inicio = formatDateInput(props.evento?.data_hora_inicio)
  form.data_hora_fim = formatDateInput(props.evento?.data_hora_fim)
  form.beneficiario_id = props.evento?.beneficiario_id ?? undefined
})

const isEdit = computed(() => Boolean(props.evento?.id))

const beneficiarioOptions = computed(() =>
  props.beneficiarios.map(b => ({
    label: `${b.nome}${b.regiao ? ` · ${b.regiao}` : ''}`,
    value: b.id
  }))
)

async function onSubmit() {
  if (!form.nome_evento.trim()) return

  saving.value = true
  const payload = {
    nome_evento: form.nome_evento.trim(),
    descricao_evento: form.descricao_evento.trim() || null,
    data_hora_inicio: toTimestamp(form.data_hora_inicio),
    data_hora_fim: toTimestamp(form.data_hora_fim),
    beneficiario_id: form.beneficiario_id ?? null
  }

  const result = isEdit.value && props.evento
    ? await update(props.evento.id, payload)
    : await create(payload)

  saving.value = false

  if (result) {
    emit('update:open', false)
    emit('saved')
  }
}
</script>

<template>
  <UModal
    :open="open"
    :title="isEdit ? 'Editar evento' : 'Novo evento'"
    description="Planeje eventos e vincule um beneficiário participante."
    @update:open="emit('update:open', $event)"
  >
    <template #body>
      <form
        class="space-y-4"
        @submit.prevent="onSubmit"
      >
        <UFormField
          label="Nome do evento"
          required
        >
          <UInput
            v-model="form.nome_evento"
            placeholder="Ex: Oficina de inclusão digital"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Descrição">
          <UTextarea
            v-model="form.descricao_evento"
            placeholder="Detalhes do evento"
            :rows="3"
            class="w-full"
          />
        </UFormField>

        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField label="Início">
            <UInput
              v-model="form.data_hora_inicio"
              type="datetime-local"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Fim">
            <UInput
              v-model="form.data_hora_fim"
              type="datetime-local"
              class="w-full"
            />
          </UFormField>
        </div>

        <UFormField label="Beneficiário vinculado">
          <USelect
            v-model="form.beneficiario_id"
            :items="beneficiarioOptions"
            placeholder="Selecione um beneficiário"
            class="w-full"
          />
        </UFormField>

        <div class="flex justify-end gap-2 pt-2">
          <UButton
            label="Cancelar"
            color="neutral"
            variant="ghost"
            @click="emit('update:open', false)"
          />
          <UButton
            type="submit"
            :label="isEdit ? 'Salvar' : 'Cadastrar'"
            :loading="saving"
            icon="i-lucide-check"
          />
        </div>
      </form>
    </template>
  </UModal>
</template>
