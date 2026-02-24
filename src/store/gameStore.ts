import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => ({
    money: 0,
    incomePerSecond: 1
  }),
  actions: {
    addMoney(amount: number) {
      this.money += amount
    }
  }
})