<script setup lang="ts">
import type { Beneficiario } from '~/types/database'
import type { TableColumn } from '@nuxt/ui'
import { formatDateTime } from '~/utils/format'

const { items, loading, fetchAll, remove } = useBeneficiarios()

const search = ref('')
const modalOpen = ref(false)
const historicoOpen = ref(false)
const selected = ref<Beneficiario | null>(null)
const historicoBenef = ref<Beneficiario | null>(null)

await fetchAll()

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return items.value
  return items.value.filter(b =>
    [b.nome, b.contato, b.regiao, String(b.indade ?? '')]
      .filter(Boolean)
      .some(v => String(v).toLowerCase().includes(q))
  )
})

const columns: TableColumn<Beneficiario>[] = [
  { accessorKey: 'nome', header: 'Nome' },
  { accessorKey: 'indade', header: 'Idade' },
  { accessorKey: 'contato', header: 'Contato' },
  { accessorKey: 'regiao', header: 'Região' },
  { accessorKey: 'created_at', header: 'Cadastro' },
  { id: 'actions', header: 'Ações' }
]

function openCreate() {
  selected.value = null
  modalOpen.value = true
}

function openEdit(row: Beneficiario) {
  selected.value = row
  modalOpen.value = true
}

function openHistorico(row: Beneficiario) {
  historicoBenef.value = row
  historicoOpen.value = true
}

async function confirmDelete(row: Beneficiario) {
  const ok = window.confirm(`Excluir o beneficiário "${row.nome}"? Eventos vinculados também serão removidos.`)
  if (!ok) return
  await remove(row.id)
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p class="text-sm text-muted">
          Cadastro e histórico de participação dos beneficiários atendidos.
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <UInput
          v-model="search"
          icon="i-lucide-search"
          placeholder="Buscar por nome, região..."
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
          Novo beneficiário
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
        <template #indade-cell="{ row }">
          {{ row.original.indade ?? '—' }}
        </template>

        <template #contato-cell="{ row }">
          {{ row.original.contato || '—' }}
        </template>

        <template #regiao-cell="{ row }">
          <UBadge
            v-if="row.original.regiao"
            color="neutral"
            variant="subtle"
          >
            {{ row.original.regiao }}
          </UBadge>
          <span
            v-else
            class="text-muted"
          >—</span>
        </template>

        <template #created_at-cell="{ row }">
          {{ formatDateTime(row.original.created_at) }}
        </template>

        <template #actions-cell="{ row }">
          <div class="flex justify-end gap-1">
            <UButton
              icon="i-lucide-history"
              color="neutral"
              variant="ghost"
              size="sm"
              aria-label="Histórico"
              @click="openHistorico(row.original)"
            />
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
        Nenhum beneficiário encontrado.
      </div>
    </UCard>

    <BeneficiarioFormModal
      v-model:open="modalOpen"
      :beneficiario="selected"
      @saved="fetchAll()"
    />

    <HistoricoModal
      v-model:open="historicoOpen"
      :beneficiario="historicoBenef"
    />
  </div>
</template>
