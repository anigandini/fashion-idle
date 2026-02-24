export type Building = {
  id: string;
  name: string;
  unlocked: boolean;
  unlockCost: number;
  level: number;
  production?: number;
  accumulated?: number;
};

export const buildings: Building[] = [
  {
    id: "boutique",
    name: "Boutique",
    unlocked: true,
    unlockCost: 0,
    level: 1,
    production: 1,
    accumulated: 0,
  },
  {
    id: "influencer",
    name: "Influencer Studio",
    unlocked: false,
    unlockCost: 50,
    level: 0,
  },
  {
    id: "atelier",
    name: "Atelier Couture",
    unlocked: false,
    unlockCost: 150,
    level: 0,
  },
];

export function updateBuildings(delta: number) {
  const boutique = buildings.find(b => b.id === "boutique");

  if (!boutique || boutique.production === undefined || boutique.accumulated === undefined) {
    return;
  }

  boutique.accumulated += boutique.production * delta;
}