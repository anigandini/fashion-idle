export type Building = {
  id: string;
  name: string;
  unlocked: boolean;
  unlockCost: number;
  level: number;
  baseProduction: number;
  storage: number;
  accumulated: number;
  upgradeBaseCost: number;
  autoCollectUnlocked: boolean;
};
