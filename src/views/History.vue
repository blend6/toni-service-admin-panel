<script setup>
import { ref, onMounted } from 'vue'
import Icon from '../components/Icon.vue'
import { supabase } from '../lib/supabase'
import { fmtDate, fmtTime } from '../lib/format'

const rows = ref([]), loading = ref(true)
onMounted(async () => {
  const { data } = await supabase.from('activity').select('*').order('created_at', { ascending: false }).limit(300)
  rows.value = data ?? []
  loading.value = false
})
</script>

<template>
  <section>
    <h2 class="text-xl font-bold text-white">Historia</h2>
    <p class="mb-4 text-xs text-gray-500">Regjistri fshihet automatikisht pas 30 ditësh.</p>
    <p v-if="loading" class="text-sm text-gray-500">Duke ngarkuar…</p>
    <p v-else-if="!rows.length" class="text-sm text-gray-500">Nuk ka veprime ende.</p>
    <ul class="space-y-2">
      <li v-for="r in rows" :key="r.id" class="flex items-center gap-4 rounded-md border border-white/10 bg-panel p-3 text-sm">
        <Icon :name="r.action === 'upload' ? 'upload' : 'arrowdown'" :size="20" class="text-brand" />
        <p class="min-w-0 flex-1 truncate"><b class="text-white">{{ r.username }}</b> {{ r.action === 'upload' ? 'dërgoi' : 'shkarkoi' }} <span class="text-gray-300">{{ r.file_name }}</span></p>
        <span class="text-xs text-gray-400">{{ fmtDate(r.created_at) }} · {{ fmtTime(r.created_at) }}</span>
      </li>
    </ul>
  </section>
</template>
