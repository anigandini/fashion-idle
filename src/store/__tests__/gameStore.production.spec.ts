import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useGameStore } from "../gameStore";

describe("GameStore - Production System", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("produces baseProduction * level into accumulated", () => {
    const store = useGameStore();

    const building = store.buildings.find(b => b.id === "clasic");
    expect(building).toBeDefined();
    if (!building) return;
    building.baseProduction = 10;
    building.level = 2;
    building.unlocked = true;

    store.tick(1); // 1 second

    expect(building.accumulated).toBe(20);
  });

  it("does not exceed storage", () => {
    const store = useGameStore();

    const building = store.buildings.find(b => b.id === "clasic");
    expect(building).toBeDefined();
    if (!building) return;
    building.baseProduction = 100;
    building.level = 1;
    building.storage = 50;
    building.unlocked = true;

    store.tick(1);

    expect(building.accumulated).toBe(50);
  });

  it("works for multiple buildings", () => {
    const store = useGameStore();

    const b1 = store.buildings[0];
    const b2 = store.buildings[1];

    expect(b1).toBeDefined();
    if (!b1) return;
    expect(b2).toBeDefined();
    if (!b2) return;


    b1.unlocked = true;
    b1.level = 1;
    b1.baseProduction = 10;

    b2.unlocked = true;
    b2.level = 2;
    b2.baseProduction = 5;

    store.tick(1);

    expect(b1.accumulated).toBe(10);
    expect(b2.accumulated).toBe(10);
  });

  it("does not produce if locked", () => {
    const store = useGameStore();

    const building = store.buildings[1];
    expect(building).toBeDefined();
    if (!building) return;
    building.unlocked = false;
    building.level = 5;
    building.baseProduction = 100;

    store.tick(1);

    expect(building.accumulated).toBe(0);
  });

  it("does not produce if level is 0", () => {
    const store = useGameStore();

    const building = store.buildings[0];
    expect(building).toBeDefined();
    if (!building) return;
    building.unlocked = true;
    building.level = 0;
    building.baseProduction = 100;

    store.tick(1);

    expect(building.accumulated).toBe(0);
  });

  it("autoCollect adds directly to money", () => {
    const store = useGameStore();

    const building = store.buildings[0];
    expect(building).toBeDefined();
    if (!building) return;

    building.unlocked = true;
    building.autoCollectUnlocked = true;
    building.storage = 20;
    building.baseProduction = 20;
    building.level = 1;

    store.tick(1);

    expect(store.money).toBe(20);
    expect(building.accumulated).toBe(0);
  });
});