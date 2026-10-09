import { createClient } from '@supabase/supabase-js'

// Cliente do Supabase, usado no browser e no servidor (Next.js App Router).
// As variáveis abaixo precisam estar definidas no arquivo `.env.local`
// (veja `.env.local.example` para saber onde encontrar cada valor).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Variáveis de ambiente do Supabase não encontradas. ' +
      'Copie ".env.local.example" para ".env.local" e preencha ' +
      'NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.'
  )
}

// Exporta um único cliente Supabase para ser reutilizado em todo o app.
// Ex.: import { supabase } from '@/lib/supabase'
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
