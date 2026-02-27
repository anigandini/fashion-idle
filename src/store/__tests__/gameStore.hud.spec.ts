import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useGameStore } from "../gameStore";

describe("HUD production calculation", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("sums production of unlocked buildings only", () => {
    const store = useGameStore();

    const clasic = store.buildings.find(b => b.id === "clasic")!;
    const romantic = store.buildings.find(b => b.id === "romantic")!;

    clasic.unlocked = true;
    clasic.level = 2;
    clasic.baseProduction = 10;

    romantic.unlocked = false;
    romantic.level = 5;
    romantic.baseProduction = 100;

    expect(store.totalProduction).toBe(20);
  });
});