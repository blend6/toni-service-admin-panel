<script setup>
import { ref, onMounted } from 'vue'
import Icon from '../components/Icon.vue'
import FileModal from '../components/FileModal.vue'
import { supabase } from '../lib/supabase'
import { download } from '../lib/files'
import { fmtDate, fmtTime, fmtSize } from '../lib/format'

const files = ref([]), open = ref(null), loading = ref(true), err = ref('')
onMounted(async () => {
  const { data, error } = await supabase.from('files').select('*').order('created_at', { ascending: false })
  if (error) err.value = error.message
  files.value = data ?? []
  loading.value = false
})
const dl = async (f) => { try { await download(f) } catch (e) { err.value = e.message } }
</script>

<template>
  <section>
    <h2 class="text-xl font-bold text-white">File-t e mia</h2>
    <p class="mb-4 text-xs text-gray-500">File-t fshihen automatikisht pas 30 ditësh.</p>
    <p v-if="err" class="mb-3 text-sm text-red-400">{{ err }}</p>
    <p v-if="loading" class="text-sm text-gray-500">Duke ngarkuar…</p>
    <p v-else-if="!files.length" class="text-sm text-gray-500">Nuk ka file ende. Dërgo të parin nga Kryefaqja.</p>
    <ul class="space-y-2">
      <li
        v-for="f in files" :key="f.id"
        class="grid cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-4 rounded-md border border-white/10 bg-panel p-3 hover:border-brand sm:grid-cols-[auto_1fr_8rem_6rem_auto]"
        @click="open = f"
      >
        <div class="rounded bg-brand/15 p-2 text-brand"><Icon name="file" :size="26" /></div>
        <div class="min-w-0">
          <p class="truncate text-sm font-medium text-white">{{ f.name }}</p>
          <p class="truncate text-xs text-gray-400">{{ f.description || 'Pa përshkrim' }}</p>
        </div>
        <div class="hidden text-xs text-gray-400 sm:block"><p>{{ fmtDate(f.created_at) }}</p><p>{{ fmtTime(f.created_at) }}</p></div>
        <div class="hidden text-xs text-gray-400 sm:block"><p>{{ f.username }}</p><p>{{ fmtSize(f.size) }}</p></div>
        <button class="rounded border border-white/10 p-2 hover:border-brand" title="Shkarko" @click.stop="dl(f)"><Icon name="download" :size="16" /></button>
      </li>
    </ul>
    <FileModal v-if="open" :file="open" @close="open = null" />
  </section>
</template>
