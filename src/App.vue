<script setup lang="ts">
import MenuView from './views/MenuView.vue'
import GameView from './views/GameView.vue'
import { useSceneManager } from './game/sceneManager'

const { currentScene } = useSceneManager()
</script>

<template>
  <MenuView v-if="currentScene === 'menu'" />
  <GameView v-else />
</template>