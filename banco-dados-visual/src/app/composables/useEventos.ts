import type { Evento, EventoComBeneficiario, EventoInsert } from '~/types/database'

export function useEventos() {
  const supabase = useSupabase()
  const toast = useToast()

  const items = useState<EventoComBeneficiario[]>('eventos', () => [])
  const loading = useState('eventos-loading', () => false)

  async function fetchAll() {
    loading.value = true
    const { data, error } = await supabase
      .from('eventos')
      .select('*, beneficiario:beneficiario_id(id, nome, regiao)')
      .order('data_hora_inicio', { ascending: false })

    loading.value = false

    if (error) {
      toast.add({ title: 'Erro ao carregar eventos', description: error.message, color: 'error' })
      return []
    }

    items.value = (data ?? []) as EventoComBeneficiario[]
    return items.value
  }

  async function fetchByBeneficiario(beneficiarioId: number) {
    const { data, error } = await supabase
      .from('eventos')
      .select('*')
      .eq('beneficiario_id', beneficiarioId)
      .order('data_hora_inicio', { ascending: false })

    if (error) {
      toast.add({ title: 'Erro ao carregar histórico', description: error.message, color: 'error' })
      return []
    }

    return (data ?? []) as Evento[]
  }

  async function create(payload: EventoInsert) {
    const { data, error } = await supabase
      .from('eventos')
      .insert(payload)
      .select()
      .single()

    if (error) {
      toast.add({ title: 'Erro ao cadastrar evento', description: error.message, color: 'error' })
      return null
    }

    toast.add({ title: 'Evento cadastrado', color: 'success' })
    await fetchAll()
    return data as Evento
  }

  async function update(id: number, payload: Partial<EventoInsert>) {
    const { data, error } = await supabase
      .from('eventos')
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      toast.add({ title: 'Erro ao atualizar evento', description: error.message, color: 'error' })
      return null
    }

    toast.add({ title: 'Evento atualizado', color: 'success' })
    await fetchAll()
    return data as Evento
  }

  async function remove(id: number) {
    const { error } = await supabase.from('eventos').delete().eq('id', id)

    if (error) {
      toast.add({ title: 'Erro ao excluir evento', description: error.message, color: 'error' })
      return false
    }

    toast.add({ title: 'Evento excluído', color: 'success' })
    await fetchAll()
    return true
  }

  return { items, loading, fetchAll, fetchByBeneficiario, create, update, remove }
}
