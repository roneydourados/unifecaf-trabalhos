import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

export function useSupabase() {
  if (client) return client

  const config = useRuntimeConfig()
  const url = String(config.public.supabaseUrl || '')
  const key = String(config.public.supabaseKey || '')

  if (!url || !key) {
    throw new Error('Defina SUPABASE_URL e SUPABASE_KEY (ou NUXT_PUBLIC_*) no arquivo .env')
  }

  client = createClient(url, key)
  return client
}
