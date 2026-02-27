import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useGameStore } from "../gameStore";

function getBuilding(store: ReturnType<typeof useGameStore>, id: string) {
  const b = store.buildings.find(b => b.id === id);
  if (!b) throw new Error("Building not found");
  return b;
}

describe("Upgrade System", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("increases level on upgrade", () => {
    const store = useGameStore();
    const building = getBuilding(store, "classic");

    building.unlocked = true;
    store.money = 1000;

    const prevLevel = building.level;

    store.upgrade("classic");

    expect(building.level).toBe(prevLevel + 1);
  });

  it("reduces player money correctly", () => {
    const store = useGameStore();
    const building = getBuilding(store, "classic");

    building.unlocked = true;
    store.money = 1000;

    const cost = store.getUpgradeCost(building);

    store.upgrade("classic");

    expect(store.money).toBe(1000 - cost);
  });

  it("increases production after upgrade", () => {
    const store = useGameStore();
    const building = getBuilding(store, "classic");

    building.unlocked = true;
    building.baseProduction = 10;
    building.level = 1;

    store.money = 1000;

    store.upgrade("classic");

    expect(building.level).toBe(2);
    expect(building.baseProduction * building.level).toBe(20);
  });

  it("increases next upgrade cost", () => {
    const store = useGameStore();
    const building = getBuilding(store, "classic");

    building.unlocked = true;
    store.money = 10000;

    const costBefore = store.getUpgradeCost(building);

    store.upgrade("classic");

    const costAfter = store.getUpgradeCost(building);

    expect(costAfter).toBeGreaterThan(costBefore);
  });

  it("does not upgrade if player has insufficient money", () => {
    const store = useGameStore();
    const building = getBuilding(store, "classic");

    building.unlocked = true;
    store.money = 0;

    const prevLevel = building.level;

    store.upgrade("classic");

    expect(building.level).toBe(prevLevel);
  });
});