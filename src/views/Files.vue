<script setup>
import { ref, onMounted } from 'vue'
import Icon from '../components/Icon.vue'
import FileModal from '../components/FileModal.vue'
import { supabase, BUCKET } from '../lib/supabase'
import { download } from '../lib/files'
import { username } from '../composables/useAuth'
import { fmtDate, fmtTime, fmtSize } from '../lib/format'

const files = ref([]), open = ref(null), loading = ref(true), err = ref('')
const editing = ref(null), deleting = ref(null), nameDraft = ref(''), descriptionDraft = ref(''), busy = ref(false)

const load = async () => {
  const { data, error } = await supabase.from('files').select('*').order('created_at', { ascending: false })
  if (error) err.value = error.message
  files.value = data ?? []
  loading.value = false
}
onMounted(load)

const dl = async (f) => { try { await download(f) } catch (e) { err.value = e.message } }
const startEdit = (f) => {
  err.value = ''
  editing.value = f
  nameDraft.value = f.name
  descriptionDraft.value = f.description ?? ''
}
const startDelete = (f) => { err.value = ''; deleting.value = f }
const saveEdit = async () => {
  if (!nameDraft.value.trim()) return (err.value = 'Emri i file-it është i detyrueshëm.')
  busy.value = true; err.value = ''
  const name = nameDraft.value.trim()
  try {
    const { data, error } = await supabase.from('files').update({ name, description: descriptionDraft.value.trim() || null }).eq('id', editing.value.id).select().maybeSingle()
    if (error) throw error
    if (!data) throw new Error('File-i nuk u ndryshua. Ekzekuto migrimin e Supabase-it për editim dhe fshirje, pastaj provo përsëri.')
    files.value = files.value.map((f) => f.id === data.id ? data : f)
    if (open.value?.id === data.id) open.value = data
    editing.value = null
    const { error: logError } = await supabase.from('activity').insert({ file_name: name, action: 'edit', username: username() })
    if (logError) err.value = `File-i u ndryshua, por historiku nuk u përditësua: ${logError.message}`
  } catch (e) { err.value = e.message }
  finally { busy.value = false }
}
const removeFile = async () => {
  busy.value = true; err.value = ''
  const f = deleting.value
  try {
    const { error: storageError } = await supabase.storage.from(BUCKET).remove([f.path])
    if (storageError) throw storageError
    const { error } = await supabase.from('files').delete().eq('id', f.id)
    if (error) throw error
    files.value = files.value.filter((item) => item.id !== f.id)
    if (open.value?.id === f.id) open.value = null
    deleting.value = null
    const { error: logError } = await supabase.from('activity').insert({ file_name: f.name, action: 'delete', username: username() })
    if (logError) err.value = `File-i u fshi, por historiku nuk u përditësua: ${logError.message}`
  } catch (e) { err.value = e.message }
  finally { busy.value = false }
}
</script>

<template>
  <section>
    <h2 class="text-xl font-bold text-white">File-t e mia</h2>
    <p class="mb-4 text-xs text-gray-500">File-t fshihen automatikisht pas 30 ditësh.</p>
    <p v-if="err" role="alert" class="mb-3 text-sm text-red-400">{{ err }}</p>
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
        <div class="flex items-center gap-1">
          <button class="rounded border border-white/10 p-2 hover:border-brand hover:text-white" title="Shkarko" aria-label="Shkarko" @click.stop="dl(f)"><Icon name="download" :size="16" /></button>
          <button class="rounded border border-white/10 p-2 hover:border-brand hover:text-white" title="Edito" aria-label="Edito" @click.stop="startEdit(f)"><Icon name="edit" :size="16" /></button>
          <button class="rounded border border-white/10 p-2 text-red-400 hover:border-red-500" title="Fshij" aria-label="Fshij" @click.stop="startDelete(f)"><Icon name="trash" :size="16" /></button>
        </div>
      </li>
    </ul>

    <FileModal v-if="open" :file="open" @close="open = null" />

    <div v-if="editing" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" @click.self="!busy && (editing = null)">
      <form class="w-full max-w-lg space-y-4 rounded-lg border border-white/10 bg-panel p-6" @submit.prevent="saveEdit">
        <h3 class="text-lg font-semibold text-white">Edito file-in</h3>
        <label class="block text-sm text-gray-300">Emri i file-it
          <input v-model="nameDraft" class="field mt-2" required />
        </label>
        <label class="block text-sm text-gray-300">Përshkrimi
          <input v-model="descriptionDraft" class="field mt-2" placeholder="Targat dhe lloji i makinës" />
        </label>
        <p v-if="err" role="alert" class="text-sm text-red-400">{{ err }}</p>
        <div class="flex justify-end gap-3 pt-2">
          <button type="button" class="rounded-md border border-white/10 px-4 py-2 text-sm hover:border-white/30" :disabled="busy" @click="editing = null">Anulo</button>
          <button class="btn-red" :disabled="busy">{{ busy ? 'Duke ruajtur…' : 'Ruaj ndryshimet' }}</button>
        </div>
      </form>
    </div>

    <div v-if="deleting" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" @click.self="!busy && (deleting = null)">
      <div class="w-full max-w-md rounded-lg border border-white/10 bg-panel p-6">
        <h3 class="text-lg font-semibold text-white">Fshije file-in?</h3>
        <p class="mt-2 break-all text-sm text-gray-400">{{ deleting.name }} do të fshihet përgjithmonë bashkë me file-in e ruajtur.</p>
        <p v-if="err" role="alert" class="mt-3 text-sm text-red-400">{{ err }}</p>
        <div class="mt-6 flex justify-end gap-3">
          <button class="rounded-md border border-white/10 px-4 py-2 text-sm hover:border-white/30" :disabled="busy" @click="deleting = null">Anulo</button>
          <button class="rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50" :disabled="busy" @click="removeFile">{{ busy ? 'Duke fshirë…' : 'Fshij file-in' }}</button>
        </div>
      </div>
    </div>
  </section>
</template>
