export interface Beneficiario {
  id: number
  created_at: string
  nome: string
  indade: number | null
  contato: string | null
  regiao: string | null
}

export interface Evento {
  id: number
  created_at: string
  nome_evento: string | null
  descricao_evento: string | null
  data_hora_inicio: string | null
  data_hora_fim: string | null
  beneficiario_id: number | null
}

export interface EventoComBeneficiario extends Evento {
  beneficiario?: Pick<Beneficiario, 'id' | 'nome' | 'regiao'> | null
}

export type BeneficiarioInsert = Omit<Beneficiario, 'id' | 'created_at'>
export type EventoInsert = Omit<Evento, 'id' | 'created_at'>
