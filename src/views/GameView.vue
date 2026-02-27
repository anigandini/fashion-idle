<script setup lang="ts">
import { onMounted } from 'vue'
import PixiCanvas from '../components/PixiCanvas.vue'
import { createGameScene } from '../scenes/GameScene'
import { startIncomeLoop } from '../game/economy'
import { useGameStore } from '../store/gameStore'
import { loadGame, saveGame } from '../game/saveSystem'

const store = useGameStore()

onMounted(() => {
  const save = loadGame()

  if (save) {
    store.money = save.money
  }

  startIncomeLoop()

  setInterval(() => {
    saveGame({ money: store.money })
  }, 5000)
})
</script>

<template>
  <PixiCanvas :setupScene="createGameScene" />
</template>