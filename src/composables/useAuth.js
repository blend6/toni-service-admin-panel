import { ref } from 'vue'
import { supabase, toEmail } from '../lib/supabase'

export const session = ref(null)
export const ready = supabase.auth.getSession().then(({ data }) => { session.value = data.session })
supabase.auth.onAuthStateChange((_e, s) => { session.value = s })

export const username = () => session.value?.user.email.split('@')[0] ?? ''
export const logout = () => supabase.auth.signOut()
export async function login(user, password) {
  const { error } = await supabase.auth.signInWithPassword({ email: toEmail(user), password })
  if (error) throw error
}
