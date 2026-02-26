import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useGameStore } from "../gameStore";

function getBuilding(store: ReturnType<typeof useGameStore>, id: string) {
  const b = store.buildings.find(b => b.id === id);
  if (!b) throw new Error("Building not found");
  return b;
}

describe("Manual Collection", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("adds accumulated to player money", () => {
    const store = useGameStore();
    const building = getBuilding(store, "clasic");

    building.unlocked = true;
    building.accumulated = 50;

    store.collect("clasic");

    expect(store.money).toBe(50);
  });

  it("resets accumulated to 0", () => {
    const store = useGameStore();
    const building = getBuilding(store, "clasic");

    building.unlocked = true;
    building.accumulated = 50;

    store.collect("clasic");

    expect(building.accumulated).toBe(0);
  });

  it("does nothing if accumulated is 0", () => {
    const store = useGameStore();
    const building = getBuilding(store, "clasic");

    building.unlocked = true;
    building.accumulated = 0;

    store.collect("clasic");

    expect(store.money).toBe(0);
  });

  it("does nothing if building is locked", () => {
    const store = useGameStore();
    const building = getBuilding(store, "clasic");

    building.unlocked = false;
    building.accumulated = 50;

    store.collect("clasic");

    expect(store.money).toBe(0);
    expect(building.accumulated).toBe(50);
  });

  it("only collects from selected building", () => {
    const store = useGameStore();
    const b1 = getBuilding(store, "clasic");
    const b2 = getBuilding(store, "romantic");

    b1.unlocked = true;
    b2.unlocked = true;

    b1.accumulated = 30;
    b2.accumulated = 70;

    store.collect("clasic");

    expect(store.money).toBe(30);
    expect(b1.accumulated).toBe(0);
    expect(b2.accumulated).toBe(70);
  });
});