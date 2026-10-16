<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Icon from './Icon.vue'
import { download } from '../lib/files'
import { fmtDate, fmtTime, fmtSize } from '../lib/format'

defineProps({ file: Object })
const emit = defineEmits(['close'])
const el = ref(null), full = ref(false), err = ref('')

const toggle = async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen()
    else { full.value = true; await el.value.requestFullscreen() }
  } catch { full.value = !full.value } // fallback për pajisje pa Fullscreen API
}
const sync = () => { if (!document.fullscreenElement) full.value = false }
const dl = async (f) => { try { await download(f) } catch (e) { err.value = e.message } }
onMounted(() => document.addEventListener('fullscreenchange', sync))
onUnmounted(() => document.removeEventListener('fullscreenchange', sync))
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" @click.self="emit('close')">
    <div ref="el" :class="full ? 'h-screen w-screen rounded-none' : 'w-full max-w-xl rounded-lg'" class="overflow-auto border border-white/10 bg-panel p-6">
      <div class="mb-6 flex items-center justify-between">
        <h3 class="flex items-center gap-3 text-lg font-semibold text-white"><Icon name="file" :size="26" class="text-brand" />{{ file.name }}</h3>
        <div class="flex gap-2">
          <button class="rounded border border-white/10 p-2 hover:border-brand" title="Full screen" @click="toggle"><Icon name="expand" :size="18" /></button>
          <button class="rounded border border-white/10 p-2 hover:border-brand" title="Mbyll" @click="emit('close')"><Icon name="x" :size="18" /></button>
        </div>
      </div>
      <dl class="grid grid-cols-[9rem_1fr] gap-y-3 text-sm">
        <dt class="text-gray-500">Përshkrimi</dt><dd class="text-white">{{ file.description || '—' }}</dd>
        <dt class="text-gray-500">Data</dt><dd>{{ fmtDate(file.created_at) }}</dd>
        <dt class="text-gray-500">Ora</dt><dd>{{ fmtTime(file.created_at) }}</dd>
        <dt class="text-gray-500">Madhësia</dt><dd>{{ fmtSize(file.size) }}</dd>
        <dt class="text-gray-500">Dërguar nga</dt><dd>{{ file.username }}</dd>
      </dl>
      <p v-if="err" class="mt-4 text-sm text-red-400">{{ err }}</p>
      <button class="btn-red mt-8" @click="dl(file)"><Icon name="download" :size="16" />Shkarko</button>
    </div>
  </div>
</template>
