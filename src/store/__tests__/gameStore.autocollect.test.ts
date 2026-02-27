import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useGameStore } from "../gameStore";

describe("Auto-collect system (Level 5 milestone)", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  function setupUnlockedBuilding() {
    const store = useGameStore();
    const b = store.buildings[0];
    if (!b) return null;
    b.unlocked = true;
    b.accumulated = 0;
    store.money = 1_000_000;

    return { store, b };
  }

  it("should unlock auto-collect at level 5", () => {
    const { store, b } = setupUnlockedBuilding();

    while (b.level < 5) {
      store.upgrade(b.id);
    }

    expect(b.level).toBe(5);
    expect(b.autoCollectUnlocked).toBe(true);
  });

  it("should NOT auto-collect before level 5", () => {
    const { store, b } = setupUnlockedBuilding();

    b.level = 4;
    b.autoCollectUnlocked = false;
    b.storage = 100;
    b.baseProduction = 1000;

    const initialMoney = store.money;

    const events = store.tick(1);

    expect(events).toHaveLength(0);
    expect(store.money).toBe(initialMoney);
    expect(b.accumulated).toBe(100);
  });

  it("should auto-collect at level 5", () => {
    const { store, b } = setupUnlockedBuilding();

    b.level = 5;
    b.autoCollectUnlocked = true;
    b.storage = 100;
    b.baseProduction = 1000;

    const initialMoney = store.money;

    const events = store.tick(1);

    expect(events.length).toBeGreaterThan(0);
    expect(store.money).toBeGreaterThan(initialMoney);
    expect(b.accumulated).toBeLessThan(100);
  });
});