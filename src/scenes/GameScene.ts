import * as PIXI from 'pixi.js'

export function createGameScene(app: PIXI.Application) {

  // fondo ciudad
  const bg = new PIXI.Graphics()
  bg.beginFill(0x87CEEB)
  bg.drawRect(0, 0, app.screen.width, app.screen.height)
  bg.endFill()
  app.stage.addChild(bg)

  // calle
  const street = new PIXI.Graphics()
  street.beginFill(0x333333)
  street.drawRect(0, app.screen.height - 150, app.screen.width, 150)
  street.endFill()
  app.stage.addChild(street)

  function createBuilding(x:number, color:number, label:string) {
    const building = new PIXI.Graphics()
    building.beginFill(color)
    building.drawRoundedRect(0, 0, 160, 220, 20)
    building.endFill()
    building.x = x
    building.y = app.screen.height - 370

    const text = new PIXI.Text(label, { fill: 0xffffff, fontSize: 14 })
    text.anchor.set(0.5)
    text.x = 80
    text.y = 110

    building.addChild(text)
    app.stage.addChild(building)
  }

  createBuilding(80, 0xff4da6, 'Tu Boutique')
  createBuilding(280, 0x6c5ce7, 'Publicidad')
  createBuilding(480, 0x00b894, 'Depósito')
}