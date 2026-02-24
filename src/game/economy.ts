import { useGameStore } from '../store/gameStore'

export function startIncomeLoop() {
  const store = useGameStore()

  setInterval(() => {
    store.addMoney(store.incomePerSecond)
  }, 1000)
}
