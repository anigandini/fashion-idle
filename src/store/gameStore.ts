import { defineStore } from 'pinia'
import type { Building } from '../game/building';

export const useGameStore = defineStore('game', {
  state: () => ({
    money: 0,
    buildings: [
      {
        id: "clasic",
        name: "Maison Clásica",
        unlocked: true,
        unlockCost: 0,
        level: 1,
        baseProduction: 1,
        storage: 30,
        accumulated: 0,
        upgradeBaseCost: 20,
        autoCollectUnlocked: false,
      },
      {
        id: "romantic",
        name: "L'Amour Boutique",
        unlocked: false,
        unlockCost: 250,
        level: 0,
        baseProduction: 5,
        storage: 80,
        accumulated: 0,
        upgradeBaseCost: 100,
        autoCollectUnlocked: false,
      },
      {
        id: "elegant",
        name: "Elegance House",
        unlocked: false,
        unlockCost: 1000,
        level: 0,
        baseProduction: 20,
        storage: 200,
        accumulated: 0,
        upgradeBaseCost: 500,
        autoCollectUnlocked: false,
      },
    ] as Building[],
  }),

  getters: {
    totalProduction(state) {
      return state.buildings.reduce((total, b) => {
        if (!b.unlocked) return total;
        return total + b.baseProduction * b.level;
      }, 0);
    },
  },

  actions: {
    // =====================
    // UPDATE (llamado desde Pixi ticker)
    // =====================
    update(delta: number) {
      this.buildings.forEach((b) => {
        if (!b.unlocked || b.level === 0) return;

        const productionPerSecond = b.baseProduction * b.level;

        if (b.autoCollectUnlocked) {
          this.money += productionPerSecond * delta;
        } else {
          const next = b.accumulated + productionPerSecond * delta;
          b.accumulated = Math.min(next, b.storage);
        }
      });
    },

    // =====================
    // COLLECT 
    // =====================
    collect(buildingId: string) {
      const b = this.buildings.find(b => b.id === buildingId);

      if (!b || !b.unlocked || b.accumulated <= 0) return;

      this.money += b.accumulated;
      b.accumulated = 0;
    },

    // =====================
    // UPGRADE
    // =====================
    upgrade(buildingId: string) {
      const b = this.buildings.find(b => b.id === buildingId);
      if (!b || !b.unlocked) return;

      const cost = this.getUpgradeCost(b);

      if (this.money < cost) return;

      this.money -= cost;
      b.level += 1;
      b.storage += 5;

      /*if (b.level >= 50) {
        b.autoCollectUnlocked = true;
      }*/
    },

    getUpgradeCost(building: Building) {
      return building.upgradeBaseCost * Math.pow(1.15, building.level);
    },

    // =====================
    // UNLOCK
    // =====================
    unlock(buildingId: string) {
      const b = this.buildings.find(b => b.id === buildingId);
      if (!b || b.unlocked) return;

      if (this.money < b.unlockCost) return;

      this.money -= b.unlockCost;
      b.unlocked = true;
      b.level = 1;
    },
  },
});