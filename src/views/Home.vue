<script setup>
import { ref } from 'vue'
import Icon from '../components/Icon.vue'
import { supabase, BUCKET, MAX_SIZE, ALLOWED } from '../lib/supabase'
import { username } from '../composables/useAuth'
import { fmtSize } from '../lib/format'

const file = ref(null), description = ref(''), over = ref(false), busy = ref(false), msg = ref(null), input = ref(null)

const pick = (f) => {
  msg.value = null
  if (!f) return
  if (!ALLOWED.includes(f.name.split('.').pop().toLowerCase())) return (msg.value = { ok: false, text: 'Lejohen vetëm file BIN, ORI, MOD dhe ZIP.' })
  if (f.size > MAX_SIZE) return (msg.value = { ok: false, text: 'File-i kalon kufirin prej 50 MB.' })
  file.value = f
}
const cancel = () => { file.value = null; description.value = ''; if (input.value) input.value.value = '' }

const send = async () => {
  busy.value = true; msg.value = null
  try {
    const f = file.value
    const path = `${crypto.randomUUID()}-${f.name.replace(/[^\w.-]+/g, '_')}`
    const up = await supabase.storage.from(BUCKET).upload(path, f)
    if (up.error) throw up.error
    const { error } = await supabase.from('files').insert({ name: f.name, size: f.size, path, description: description.value.trim() || null, username: username() })
    if (error) throw error
    await supabase.from('activity').insert({ file_name: f.name, action: 'upload', username: username() })
    cancel()
    msg.value = { ok: true, text: 'File u dërgua me sukses.' }
  } catch (e) { msg.value = { ok: false, text: 'Dërgimi dështoi: ' + e.message } }
  finally { busy.value = false }
}

const features = [
  { icon: 'cpu', title: 'ECU FILES', text: 'Mbështet të gjitha llojet e file-ve ECU.' },
  { icon: 'zap', title: 'FILE TË MËDHENJ', text: 'Dërgo file deri në 50 MB.' },
  { icon: 'shield', title: 'PRIVATËSI', text: 'Qasje vetëm për llogaritë e autorizuara.' },
  { icon: 'clock', title: 'I PËRSHTATSHËM', text: 'Funksionon në çdo sistem operativ.' }
]
</script>

<template>
  <div class="grid gap-4 lg:grid-cols-[2fr_1fr]">
    <section class="rounded-lg border border-white/10 bg-panel p-4">
      <div
        class="flex min-h-[280px] flex-col items-center justify-center rounded-md border border-dashed p-6 text-center transition"
        :class="over ? 'border-brand bg-brand/10' : 'border-white/20'"
        @dragover.prevent="over = true" @dragleave="over = false" @drop.prevent="over = false; pick($event.dataTransfer.files[0])"
      >
        <template v-if="!file">
          <Icon name="upload" :size="56" class="text-brand" />
          <h2 class="mt-3 text-2xl font-extrabold italic text-white">DËRGO FILE ECU</h2>
          <p class="mt-2 text-sm text-gray-400">Tërhiq file-t këtu ose zgjidhi nga kompjuteri</p>
          <p class="mt-3 text-xs tracking-widest text-gray-500">BIN · ORI · MOD · ZIP</p>
          <button class="btn-red mt-5" @click="input.click()"><Icon name="folder" :size="16" />Zgjidh File</button>
        </template>
        <div v-else class="w-full max-w-md space-y-4 text-left">
          <div class="flex items-center gap-3 rounded-md border border-white/10 p-3">
            <Icon name="file" :size="28" class="text-brand" />
            <div class="min-w-0"><p class="truncate text-sm font-medium text-white">{{ file.name }}</p><p class="text-xs text-gray-500">{{ fmtSize(file.size) }}</p></div>
          </div>
          <label class="block text-xs text-gray-400">Përshkrimi (targat dhe lloji i makinës)
            <input v-model="description" class="field mt-1" placeholder="p.sh. 01-123-AB · Golf 7 2.0 TDI" />
          </label>
          <div class="flex gap-3">
            <button class="btn-red" :disabled="busy" @click="send">{{ busy ? 'Duke dërguar…' : 'Dërgo' }}</button>
            <button class="rounded-md border border-white/10 px-5 text-sm hover:border-brand" :disabled="busy" @click="cancel">Anulo</button>
          </div>
        </div>
        <p v-if="msg" class="mt-4 text-sm" :class="msg.ok ? 'text-green-400' : 'text-red-400'">{{ msg.text }}</p>
        <input ref="input" type="file" class="hidden" accept=".bin,.ori,.mod,.zip" @change="pick($event.target.files[0])" />
      </div>
    </section>

    <section class="rounded-lg border border-white/10 bg-panel p-5">
      <h3 class="mb-3 flex items-center gap-2 font-bold italic text-white"><Icon name="shield" :size="18" />TRANSFER I SIGURT</h3>
      <p class="mb-6 text-sm text-gray-400">File-t tua transferohen në mënyrë të sigurt me enkriptim të avancuar.</p>
      <div class="grid grid-cols-3 gap-2 text-center text-xs text-gray-400">
        <div><Icon name="lock" class="mx-auto mb-1 text-brand" />Enkriptim i avancuar</div>
        <div><Icon name="home" class="mx-auto mb-1 text-brand" />Në çdo pajisje</div>
        <div><Icon name="zap" class="mx-auto mb-1 text-brand" />Shpejt &amp; pa probleme</div>
      </div>
    </section>

    <section class="grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-4">
      <div v-for="f in features" :key="f.title" class="flex gap-3 bg-panel p-4">
        <Icon :name="f.icon" :size="30" class="shrink-0 text-brand" />
        <div><h4 class="text-xs font-bold text-white">{{ f.title }}</h4><p class="mt-1 text-xs text-gray-400">{{ f.text }}</p></div>
      </div>
    </section>
  </div>
</template>
