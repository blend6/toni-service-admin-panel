import { supabase, BUCKET } from './supabase'
import { username } from '../composables/useAuth'

export async function download(f) {
  const { data, error } = await supabase.storage.from(BUCKET).download(f.path)
  if (error) throw error
  const a = document.createElement('a')
  a.href = URL.createObjectURL(data)
  a.download = f.name
  a.click()
  URL.revokeObjectURL(a.href)
  await supabase.from('activity').insert({ file_name: f.name, action: 'download', username: username() })
}
