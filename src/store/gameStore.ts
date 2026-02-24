import { defineStore } from 'pinia'
import { buildings } from '../game/buildings'

export const useGameStore = defineStore('game', {
  state: () => ({
    money: 0,
    storedCash: 0,
    maxStorage: 50,
    incomePerSecond: 0.2,
    clickValue: 1,
    buildings
  }),

  actions: {
    addMoney(amount: number) {
      this.money += amount
    },

    produceIncome(delta: number) {
      const produced = this.incomePerSecond * delta

      this.storedCash += produced

      if (this.storedCash > this.maxStorage) {
        this.storedCash = this.maxStorage
      }
    },

    collectCash() {
      const boutique = this.buildings.find(b => b.id === "boutique");
      if (!boutique) return;

      this.money += boutique.accumulated ?? 0;
      boutique.accumulated = 0;
    },

    clickEarn() {
      this.money += this.clickValue
    },

    unlockBuilding(id: string) {
      const b = this.buildings.find(b => b.id === id)
      if (!b || b.unlocked) return

      if (this.money < b.unlockCost) return

      this.money -= b.unlockCost
      b.unlocked = true
      b.level = 1

      if (id === 'atelier') this.incomePerSecond += 3
      if (id === 'influencer') this.incomePerSecond += 1
    },

    upgradeBuilding(id: string) {
      const b = this.buildings.find(b => b.id === id)
      if (!b || !b.unlocked) return

      const cost = this.getUpgradeCost(b)

      if (this.money < cost) return

      this.money -= cost
      b.level++

      if (id === 'boutique') {
        this.clickValue += 1
        this.incomePerSecond += 0.5
      }

      if (id === 'influencer') {
        this.incomePerSecond += 1.5
      }

      if (id === 'atelier') {
        this.incomePerSecond += 3
      }
    },

    getUpgradeCost(b) {
      return Math.floor(20 * Math.pow(1.4, b.level))
    }
  }
})