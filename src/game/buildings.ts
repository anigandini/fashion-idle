export type Building = {
  id: string
  name: string
  unlocked: boolean
  unlockCost: number
  level: number
}

export const buildings: Building[] = [
  {
    id: 'boutique',
    name: 'Boutique',
    unlocked: true,
    unlockCost: 0,
    level: 1
  },
  {
    id: 'influencer',
    name: 'Influencer Studio',
    unlocked: false,
    unlockCost: 50,
    level: 0
  },
  {
    id: 'atelier',
    name: 'Atelier Couture',
    unlocked: false,
    unlockCost: 150,
    level: 0
  }]