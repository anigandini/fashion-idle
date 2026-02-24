import * as PIXI from 'pixi.js'
import { useGameStore } from '../store/gameStore'

export function createGameScene(app: PIXI.Application) {
  const store = useGameStore()

  const buildingsMap: Record<string, PIXI.Container> = {}

  // cielo
  const bg = new PIXI.Graphics()
  bg.beginFill(0xf8d7ff)
  bg.drawRect(0, 0, app.screen.width, app.screen.height)
  bg.endFill()
  app.stage.addChild(bg)

  // calle
  const street = new PIXI.Graphics()
  street.beginFill(0x333333)
  street.drawRect(0, app.screen.height - 150, app.screen.width, 150)
  street.endFill()
  app.stage.addChild(street)

  function createBuilding(x:number, label:string, color:number, id:string) {
    const container = new PIXI.Container()

    const building = new PIXI.Graphics()
    building.beginFill(color)
    building.drawRoundedRect(0, 0, 160, 220, 20)
    building.endFill()

    building.eventMode = 'static'
    building.cursor = 'pointer'

    building.on('pointerdown', () => {
      const b = store.buildings.find(b => b.id === id)

      if (!b?.unlocked) {
        store.unlockBuilding(id)
        updateVisibility()
        return
      }

      if (id === 'boutique') {
        store.clickEarn()
      } else {
        store.upgradeBuilding(id)
      }

      container.scale.set(0.95)
      setTimeout(() => container.scale.set(1), 100)
    })

    const text = new PIXI.Text(label, {
      fill: 0xffffff,
      fontSize: 14,
      align: 'center'
    })
    text.anchor.set(0.5)
    text.x = 80
    text.y = 110

    container.addChild(building, text)
    container.x = x
    container.y = app.screen.height - 370

    app.stage.addChild(container)
    buildingsMap[id] = container
  }

  createBuilding(80, 'Boutique', 0xff4da6, 'boutique')
  createBuilding(280, '📸 Influencer', 0x6c5ce7, 'influencer')
  createBuilding(480, '🧵 Atelier', 0x00b894, 'atelier')

  function updateVisibility() {
    store.buildings.forEach(b => {
      const container = buildingsMap[b.id]
      if (!container) return
      container.alpha = b.unlocked ? 1 : 0.35
    })
  }

  updateVisibility()
}