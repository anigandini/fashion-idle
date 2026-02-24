<script setup lang="ts">
import { useGameStore } from '../../store/gameStore'

const store = useGameStore()
</script>

<template>
  <div class="badge">
    💰 {{ store.money.toFixed(0) }}
  </div>
</template>

<style scoped>
.badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: #ff4da6;
  color: white;
  padding: 10px 16px;
  border-radius: 20px;
  font-weight: bold;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}
</style>