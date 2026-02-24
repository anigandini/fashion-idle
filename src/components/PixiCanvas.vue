<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Application } from 'pixi.js'

const props = defineProps<{
  setupScene: (app: Application) => void
}>()

const container = ref<HTMLDivElement | null>(null)

onMounted(async () => {

  const app = new Application()

  await app.init({
    resizeTo: window,
    backgroundAlpha: 0,
    antialias: true
  })

  if (container.value && app.canvas) {
    container.value.appendChild(app.canvas)
  }

  props.setupScene(app)
  
})
</script>

<template>
  <div ref="container"></div>
</template>