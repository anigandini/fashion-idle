import * as PIXI from "pixi.js";
import { useGameStore } from "../store/gameStore";

export function createHUD(app: PIXI.Application) {
  const store = useGameStore();

  const hud = new PIXI.Container();
  app.stage.addChild(hud);

  // ===== TOP BAR BACKGROUND =====
  const bar = new PIXI.Graphics()
    .beginFill(0x000000, 0.35)
    .drawRoundedRect(10, 10, app.screen.width - 20, 60, 20)
    .endFill();

  hud.addChild(bar);

  // ===== MONEY =====
  const moneyText = new PIXI.Text("$0", {
    fontSize: 26,
    fill: 0xffffff,
    fontWeight: "bold",
  });

  moneyText.x = 30;
  moneyText.y = 25;
  hud.addChild(moneyText);

  // ===== INCOME =====
  const incomeText = new PIXI.Text("$0/sec", {
    fontSize: 16,
    fill: 0xfff2a8,
  });

  incomeText.x = 30;
  incomeText.y = 48;
  hud.addChild(incomeText);

  // ===== EMPIRE LEVEL (future progression) =====
  const levelText = new PIXI.Text("Empire Lv.1", {
    fontSize: 16,
    fill: 0xffffff,
  });

  levelText.anchor.set(0.5);
  levelText.x = app.screen.width / 2;
  levelText.y = 40;
  hud.addChild(levelText);

  // ===== SETTINGS BUTTON PLACEHOLDER =====
  const settings = new PIXI.Text("⚙", {
    fontSize: 24,
  });

  settings.anchor.set(1, 0.5);
  settings.x = app.screen.width - 25;
  settings.y = 40;
  hud.addChild(settings);

  settings.eventMode = "static";
  settings.cursor = "pointer";

  settings.on("pointerdown", () => {
    console.log("settings clicked");
  });

  // ===== UPDATE LOOP =====
  let previousMoney = -1;

  app.ticker.add(() => {
    // money update
    if (store.money !== previousMoney) {
      moneyText.text = `$${Math.floor(store.money)}`;

      // animación suave
      moneyText.scale.set(1.15);
      setTimeout(() => moneyText.scale.set(1), 120);

      previousMoney = store.money;
    }

    // income update
    incomeText.text = `⚡ ${Math.floor(store.totalProduction)} /s`;
  });

  return hud;
}