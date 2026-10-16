<script setup>
defineProps({ size: { type: String, default: 'w-36' } })
</script>

<template>
  <img
    src="/logo.png"
    alt="Auto Elektro Toni Servis — 048 628 300"
    :class="['block h-auto object-contain', size]"
  />
</template>
