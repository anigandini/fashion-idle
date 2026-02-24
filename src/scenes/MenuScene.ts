import * as PIXI from 'pixi.js'
import { useSceneManager } from '../game/sceneManager'

export function createMenuScene(app: PIXI.Application) {
  const { goToGame } = useSceneManager()

  const title = new PIXI.Text('FASHION EMPIRE IDLE', {
    fill: 0xffffff,
    fontSize: 42,
    fontWeight: 'bold'
  })

  title.anchor.set(0.5)
  title.x = app.screen.width / 2
  title.y = 200

  const startBtn = new PIXI.Text('START', {
    fill: 0xff4da6,
    fontSize: 36
  })

  startBtn.anchor.set(0.5)
  startBtn.x = app.screen.width / 2
  startBtn.y = 350
  startBtn.eventMode = 'static'
  startBtn.cursor = 'pointer'

  startBtn.on('pointerdown', () => {
    goToGame()
  })

  app.stage.addChild(title, startBtn)
}