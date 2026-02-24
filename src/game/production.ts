import type { Item } from "../types/game";
import { gameState } from "./economy";

export const items: Item[] = [
  {
    name: "Baby Tee",
    baseCost: 10,
    income: 1,
    owned: 0,
  },
];

export function buyItem(item: Item): void {
  if (gameState.money >= item.baseCost) {
    gameState.money -= item.baseCost;

    item.owned++;

    gameState.incomePerSecond += item.income;

    item.baseCost *= 1.15;
  }
}