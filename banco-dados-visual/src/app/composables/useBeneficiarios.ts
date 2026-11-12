import type { Beneficiario, BeneficiarioInsert } from '~/types/database'

export function useBeneficiarios() {
  const supabase = useSupabase()
  const toast = useToast()

  const items = useState<Beneficiario[]>('beneficiarios', () => [])
  const loading = useState('beneficiarios-loading', () => false)

  async function fetchAll() {
    loading.value = true
    const { data, error } = await supabase
      .from('beneficiario')
      .select('*')
      .order('created_at', { ascending: false })

    loading.value = false

    if (error) {
      toast.add({ title: 'Erro ao carregar beneficiários', description: error.message, color: 'error' })
      return []
    }

    items.value = data ?? []
    return items.value
  }

  async function create(payload: BeneficiarioInsert) {
    const { data, error } = await supabase
      .from('beneficiario')
      .insert(payload)
      .select()
      .single()

    if (error) {
      toast.add({ title: 'Erro ao cadastrar', description: error.message, color: 'error' })
      return null
    }

    toast.add({ title: 'Beneficiário cadastrado', color: 'success' })
    await fetchAll()
    return data as Beneficiario
  }

  async function update(id: number, payload: Partial<BeneficiarioInsert>) {
    const { data, error } = await supabase
      .from('beneficiario')
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      toast.add({ title: 'Erro ao atualizar', description: error.message, color: 'error' })
      return null
    }

    toast.add({ title: 'Beneficiário atualizado', color: 'success' })
    await fetchAll()
    return data as Beneficiario
  }

  async function remove(id: number) {
    const { error } = await supabase.from('beneficiario').delete().eq('id', id)

    if (error) {
      toast.add({ title: 'Erro ao excluir', description: error.message, color: 'error' })
      return false
    }

    toast.add({ title: 'Beneficiário excluído', color: 'success' })
    await fetchAll()
    return true
  }

  return { items, loading, fetchAll, create, update, remove }
}
