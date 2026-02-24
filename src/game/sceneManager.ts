import { ref } from 'vue'

const currentScene = ref<'menu' | 'game'>('menu')

export function useSceneManager() {
  const goToGame = () => currentScene.value = 'game'
  const goToMenu = () => currentScene.value = 'menu'

  return {
    currentScene,
    goToGame,
    goToMenu
  }
}