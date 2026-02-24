import { useGameStore } from '../store/gameStore'

export function startIncomeLoop() {
  const store = useGameStore()

  setInterval(() => {
    store.produceIncome(store.incomePerSecond)
  }, 1000)
}
