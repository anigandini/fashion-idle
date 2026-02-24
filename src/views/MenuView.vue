<script setup lang="ts">
import PixiCanvas from '../components/PixiCanvas.vue'
import { createMenuScene } from '../scenes/MenuScene'
</script>

<template>
  <PixiCanvas :setupScene="createMenuScene" />
</template>