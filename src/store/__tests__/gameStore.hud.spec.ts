import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useGameStore } from "../gameStore";

describe("HUD production calculation", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("sums production of unlocked buildings only", () => {
    const store = useGameStore();

    const classic = store.buildings.find(b => b.id === "classic")!;
    const romantic = store.buildings.find(b => b.id === "romantic")!;

    classic.unlocked = true;
    classic.level = 2;
    classic.baseProduction = 10;

    romantic.unlocked = false;
    romantic.level = 5;
    romantic.baseProduction = 100;

    expect(store.totalProduction).toBe(20);
  });
});