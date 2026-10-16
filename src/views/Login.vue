<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Logo from '../components/Logo.vue'
import { login } from '../composables/useAuth'

const router = useRouter()
const user = ref(''), pass = ref(''), err = ref(''), busy = ref(false)
const submit = async () => {
  busy.value = true; err.value = ''
  try { await login(user.value, pass.value); router.push('/') }
  catch (e) { err.value = e.message }
  finally { busy.value = false }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center p-4">
    <form class="w-full max-w-sm space-y-4 rounded-lg border border-white/10 bg-panel p-8" @submit.prevent="submit">
      <div class="flex justify-center pb-2"><Logo /></div>
      <h1 class="text-center text-xl font-extrabold italic"><span class="text-brand">ECU</span> FILE TRANSFER</h1>
      <input v-model="user" class="field" placeholder="Username" autocomplete="username" required />
      <input v-model="pass" type="password" class="field" placeholder="Fjalëkalimi" autocomplete="current-password" required />
      <p v-if="err" class="text-sm text-red-400">{{ err }}</p>
      <button class="btn-red w-full" :disabled="busy">{{ busy ? 'Duke u kyçur…' : 'Kyçu' }}</button>
    </form>
  </div>
</template>
