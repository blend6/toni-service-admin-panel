import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
export const BUCKET = 'ecu-files'
export const MAX_SIZE = 50 * 1024 * 1024
export const ALLOWED = ['bin', 'ori', 'mod', 'zip']
// Supabase Auth kërkon email, ndaj username-i kthehet në një email të brendshëm.
export const toEmail = (u) => `${u.trim().toLowerCase()}@toni.local`
