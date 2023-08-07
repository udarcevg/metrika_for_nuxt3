<template>
  <div>
    Works!
  </div>
</template>

<script setup lang="ts">
import { useNuxtApp, useHead } from '#app'
const { $ym } = useNuxtApp()
useHead({
  title: 'Startpage'
})
if ($ym) {
  $ym('hit', '/', {
    referer: '/',
    title: 'test'
  })
}
</script>
