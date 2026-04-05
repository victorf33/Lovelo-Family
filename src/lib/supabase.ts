import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são obrigatórias.'
  )
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// ─── Helpers de Storage ───────────────────────────────────────────────────────
export async function uploadAsset(
  userId: string,
  file: File
): Promise<string> {
  const ext = file.name.split('.').pop()
  const path = `${userId}/${Date.now()}.${ext}`

  const { error } = await supabase.storage
    .from('brand-assets')
    .upload(path, file, { upsert: false })

  if (error) throw error

  const { data } = supabase.storage.from('brand-assets').getPublicUrl(path)
  return data.publicUrl
}

export async function uploadPreview(
  designId: string,
  blob: Blob
): Promise<string> {
  const path = `${designId}/preview-${Date.now()}.png`

  const { error } = await supabase.storage
    .from('design-previews')
    .upload(path, blob, { upsert: true, contentType: 'image/png' })

  if (error) throw error

  const { data } = supabase.storage.from('design-previews').getPublicUrl(path)
  return data.publicUrl
}
