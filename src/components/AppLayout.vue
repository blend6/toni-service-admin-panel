<script setup>
import { useRouter } from 'vue-router'
import Icon from './Icon.vue'
import Logo from './Logo.vue'
import { logout, username } from '../composables/useAuth'

const router = useRouter()
const nav = [
  { to: '/', label: 'Kryefaqja', icon: 'home' },
  { to: '/dergo', label: 'Dërgo File', icon: 'upload' },
  { to: '/files', label: 'File-t e mia', icon: 'folder' },
  { to: '/historia', label: 'Historia', icon: 'clock' }
]
const out = async () => { await logout(); router.push('/login') }
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <header class="flex items-center gap-8 border-b border-white/10 px-6 py-4">
      <Logo />
      <div class="hidden border-l-2 border-brand pl-6 sm:block">
        <h1 class="text-2xl font-extrabold italic"><span class="text-brand">ECU</span> FILE TRANSFER</h1>
        <p class="text-xs tracking-[0.3em] text-gray-400">SHPEJT · SIGURT · PROFESIONAL</p>
      </div>
    </header>
    <div class="flex flex-1">
      <aside class="hidden w-56 shrink-0 flex-col justify-between border-r border-white/10 py-4 md:flex">
        <nav>
          <RouterLink
            v-for="n in nav" :key="n.to" :to="n.to"
            class="flex items-center gap-3 border-l-4 border-transparent px-5 py-3 text-sm text-gray-400 hover:text-white"
            active-class="!border-brand bg-brand/15 !text-white"
          >
            <Icon :name="n.icon" :size="18" />{{ n.label }}
          </RouterLink>
        </nav>
        <div class="mx-4 rounded-md border border-white/10 p-3 text-xs text-gray-400">
          <div class="mb-2 flex items-center gap-2 text-gray-200"><Icon name="shield" :size="16" />Privat &amp; i Sigurt</div>
          <p class="mb-3">Të dhënat tuaja janë të mbrojtura.</p>
          <p class="mb-2 text-white">{{ username() }}</p>
          <button class="flex items-center gap-2 text-brand hover:underline" @click="out"><Icon name="logout" :size="14" />Dil</button>
        </div>
      </aside>
      <main class="min-w-0 flex-1 p-5"><RouterView /></main>
    </div>
    <footer class="flex justify-between border-t border-white/10 px-6 py-3 text-xs text-gray-500">
      <span>AUTO ELEKTRO <b class="italic text-brand">TONI</b> SERVIS</span>
      <span>Diagnostikë · ECU · Kodim · Riparime Elektronike</span>
    </footer>
  </div>
</template>
