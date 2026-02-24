export type Building = {
  id: string;
  name: string;
  unlocked: boolean;
  unlockCost: number;
  level: number;
  production?: number;
  accumulated?: number;
  storage?: number; 
};

export const buildings: Building[] = [
  {
    id: "boutique",
    name: "Boutique",
    unlocked: true,
    unlockCost: 0,
    level: 1,
    production: 0.2,
    accumulated: 0,
    storage: 30,
  },
  {
    id: "influencer",
    name: "Influencer Studio",
    unlocked: false,
    unlockCost: 50,
    level: 0,
    production: 0.5,
    accumulated: 0,
    storage: 50,
  },
  {
    id: "atelier",
    name: "Atelier Couture",
    unlocked: false,
    unlockCost: 150,
    level: 0,
    production: 2,
    accumulated: 0,
    storage: 80,
  },
];


export function updateBuildings(delta: number) {
  for (const building of buildings) {
    if (!building.unlocked) continue;
    if (building.production === undefined) continue;
    if (building.accumulated === undefined) continue;

    const productionPerSecond = building.production * building.level;

    const nextValue =
      building.accumulated + productionPerSecond * delta;

    const maxStorage = building.storage ?? Infinity;

    building.accumulated = Math.min(nextValue, maxStorage);
  }
}