<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Logo from '../components/Logo.vue'
import Icon from '../components/Icon.vue'
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
  <main class="relative isolate min-h-screen overflow-hidden bg-[#09090b] text-gray-100">
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_18%_45%,rgba(225,29,46,0.16),transparent_42%),radial-gradient(ellipse_at_88%_8%,rgba(255,255,255,0.05),transparent_30%)]"></div>
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]"></div>

    <div class="mx-auto grid min-h-screen w-full max-w-7xl items-center gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[1fr_440px] lg:gap-20 lg:px-12">
      <section class="flex flex-col items-center text-center lg:items-start lg:text-left">
        <div class="mb-5 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-300">
          <span class="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_10px_2px_rgba(239,68,68,0.6)]"></span>
          Auto Elektro Toni · Servis
        </div>
        <Logo size="w-64 max-w-full sm:w-80 lg:w-[26rem]" />
        <div class="mt-7 max-w-lg">
          <p class="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500">Platformë për klientë të autorizuar</p>
          <h1 class="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">Diagnostikë dhe menaxhim i file-ve ECU</h1>
          <p class="mt-3 text-sm leading-6 text-gray-400">Hyni në panelin tuaj për të dërguar, gjetur dhe menaxhuar file-t në mënyrë të sigurt.</p>
        </div>
        <div class="mt-8 hidden w-full max-w-lg grid-cols-3 border-t border-white/10 pt-5 text-left sm:grid">
          <div class="pr-3"><Icon name="cpu" :size="18" class="mb-2 text-red-500" /><p class="text-xs font-semibold text-gray-200">ECU files</p><p class="mt-1 text-[11px] text-gray-500">BIN · ORI · MOD</p></div>
          <div class="border-l border-white/10 px-4"><Icon name="shield" :size="18" class="mb-2 text-red-500" /><p class="text-xs font-semibold text-gray-200">Qasje private</p><p class="mt-1 text-[11px] text-gray-500">Vetëm me llogari</p></div>
          <div class="border-l border-white/10 pl-4"><Icon name="zap" :size="18" class="mb-2 text-red-500" /><p class="text-xs font-semibold text-gray-200">Dërgim i shpejtë</p><p class="mt-1 text-[11px] text-gray-500">Deri në 50 MB</p></div>
        </div>
      </section>

      <section class="w-full justify-self-center lg:justify-self-end">
        <form class="w-full max-w-md rounded-2xl border border-white/10 bg-[#111115]/90 p-6 shadow-[0_24px_100px_-32px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:p-9" @submit.prevent="submit">
          <div class="mb-8">
            <div class="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400"><Icon name="lock" :size="20" /></div>
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">Hyrje e sigurt</p>
            <h2 class="mt-2 text-2xl font-bold tracking-tight text-white">Mirë se u kthyet</h2>
            <p class="mt-2 text-sm text-gray-400">Shkruani të dhënat e llogarisë për të vazhduar.</p>
          </div>

          <div class="space-y-5">
            <label class="block text-sm font-medium text-gray-300">
              Emri i përdoruesit
              <input v-model="user" class="mt-2 w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-red-500/70 focus:ring-2 focus:ring-red-500/10" placeholder="Shkruani username" autocomplete="username" required />
            </label>
            <label class="block text-sm font-medium text-gray-300">
              Fjalëkalimi
              <input v-model="pass" type="password" class="mt-2 w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-red-500/70 focus:ring-2 focus:ring-red-500/10" placeholder="Shkruani fjalëkalimin" autocomplete="current-password" required />
            </label>

            <div v-if="err" role="alert" class="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-sm text-red-300">{{ err }}</div>
            <button class="group flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-red-950/40 transition hover:from-red-500 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-red-400/60 focus:ring-offset-2 focus:ring-offset-[#111115] disabled:cursor-wait disabled:opacity-60" :disabled="busy">
              {{ busy ? 'Duke u kyçur…' : 'Kyçu në panel' }}
              <span v-if="!busy" aria-hidden="true" class="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>

          <div class="mt-7 flex items-center justify-center gap-2 border-t border-white/10 pt-5 text-xs text-gray-500">
            <Icon name="shield" :size="14" class="text-gray-600" />
            Lidhja dhe qasja juaj janë të mbrojtura.
          </div>
        </form>
        <p class="mt-5 text-center text-[11px] tracking-wide text-gray-600">AUTO ELEKTRO TONI · DIAGNOSTIKË · ECU · KODIM</p>
      </section>
    </div>
  </main>
</template>
