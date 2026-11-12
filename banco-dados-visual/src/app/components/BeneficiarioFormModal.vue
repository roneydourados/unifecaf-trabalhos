<script setup lang="ts">
import type { Beneficiario } from '~/types/database'

const props = defineProps<{
  open: boolean
  beneficiario?: Beneficiario | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  saved: []
}>()

const { create, update } = useBeneficiarios()
const saving = ref(false)

const form = reactive({
  nome: '',
  indade: undefined as number | undefined,
  contato: '',
  regiao: ''
})

watch(() => props.open, (isOpen) => {
  if (!isOpen) return
  form.nome = props.beneficiario?.nome ?? ''
  form.indade = props.beneficiario?.indade ?? undefined
  form.contato = props.beneficiario?.contato ?? ''
  form.regiao = props.beneficiario?.regiao ?? ''
})

const isEdit = computed(() => Boolean(props.beneficiario?.id))

async function onSubmit() {
  if (!form.nome.trim()) return

  saving.value = true
  const payload = {
    nome: form.nome.trim(),
    indade: form.indade ?? null,
    contato: form.contato.trim() || null,
    regiao: form.regiao.trim() || null
  }

  const result = isEdit.value && props.beneficiario
    ? await update(props.beneficiario.id, payload)
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
    :title="isEdit ? 'Editar beneficiário' : 'Novo beneficiário'"
    description="Cadastre nome, idade, contato e região atendida."
    @update:open="emit('update:open', $event)"
  >
    <template #body>
      <form
        class="space-y-4"
        @submit.prevent="onSubmit"
      >
        <UFormField
          label="Nome"
          required
        >
          <UInput
            v-model="form.nome"
            placeholder="Nome completo"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Idade">
          <UInput
            v-model.number="form.indade"
            type="number"
            min="0"
            max="120"
            placeholder="Ex: 28"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Contato">
          <UInput
            v-model="form.contato"
            placeholder="Telefone, e-mail ou WhatsApp"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Região">
          <UInput
            v-model="form.regiao"
            placeholder="Ex: Zona Sul, Capão Redondo"
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
