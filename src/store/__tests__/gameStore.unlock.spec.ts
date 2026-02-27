import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useGameStore } from "../gameStore";

function getBuilding(store: ReturnType<typeof useGameStore>, id: string) {
    const b = store.buildings.find(b => b.id === id);
    if (!b) throw new Error("Building not found");
    return b;
}

describe("Unlock System", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it("starts locked", () => {
        const store = useGameStore();
        const building = getBuilding(store, "romantic");

        expect(building.unlocked).toBe(false);
    });

    it("unlocks when player has enough money", () => {
        const store = useGameStore();
        const building = getBuilding(store, "romantic");

        store.money = building.unlockCost;

        store.unlock("romantic");

        expect(building.unlocked).toBe(true);
        expect(building.level).toBe(1);
    });

    it("deducts money on unlock", () => {
        const store = useGameStore();
        const building = getBuilding(store, "romantic");

        store.money = building.unlockCost;

        store.unlock("romantic");

        expect(store.money).toBe(0);
    });

    it("does not unlock if insufficient money", () => {
        const store = useGameStore();
        const building = getBuilding(store, "romantic");

        store.money = 0;

        store.unlock("romantic");

        expect(building.unlocked).toBe(false);
    });

    it("starts producing after unlock", () => {
        const store = useGameStore();
        const building = getBuilding(store, "romantic");

        store.money = building.unlockCost;
        store.unlock("romantic");

        const prevAccumulated = building.accumulated;

        store.tick(1); // simulate 1 second

        expect(building.accumulated).toBeGreaterThan(prevAccumulated);
    });

    it("does not produce while locked", () => {
        const store = useGameStore();
        const building = getBuilding(store, "romantic");

        const prevAccumulated = building.accumulated;

        store.tick(1);

        expect(building.accumulated).toBe(prevAccumulated);
    });
});