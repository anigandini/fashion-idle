import * as PIXI from "pixi.js";
import { useGameStore } from "../store/gameStore";
import { updateBuildings } from "../game/buildings";
import { createHUD } from "../game/hud";

export function createGameScene(app: PIXI.Application) {
  const store = useGameStore();

  const buildingsMap: Record<string, PIXI.Container> = {};
  const cashLabels: Record<string, PIXI.Text> = {};
  const levelLabels: Record<string, PIXI.Text> = {};

  // 🌸 SKY
  const bg = new PIXI.Graphics()
    .beginFill(0xf8d7ff)
    .drawRect(0, 0, app.screen.width, app.screen.height)
    .endFill();

  app.stage.addChild(bg);

  // 🛣 STREET
  const street = new PIXI.Graphics()
    .beginFill(0x333333)
    .drawRect(0, app.screen.height - 150, app.screen.width, 150)
    .endFill();

  app.stage.addChild(street);

  function createBuilding(x: number, label: string, color: number, id: string) {
    const container = new PIXI.Container();

    const building = new PIXI.Graphics()
      .beginFill(color)
      .drawRoundedRect(0, 0, 160, 220, 20)
      .endFill();

    building.eventMode = "static";
    building.cursor = "pointer";

    building.on("pointerdown", () => {
      const b = store.buildings.find(b => b.id === id);

      if (!b?.unlocked) {
        store.unlockBuilding(id);
        updateVisibility();
        return;
      }

      if (id === "boutique") {
        store.collectCash();
      } else {
        store.upgradeBuilding(id);
      }

      // click feedback
      container.scale.set(0.92);
      setTimeout(() => container.scale.set(1), 90);
    });

    // building label
    const text = new PIXI.Text(label, {
      fill: 0xffffff,
      fontSize: 14,
      align: "center",
    });

    text.anchor.set(0.5);
    text.x = 80;
    text.y = 110;

    // level label
    const levelText = new PIXI.Text("", {
      fontSize: 12,
      fill: 0xffffff,
    });

    levelText.anchor.set(1);
    levelText.x = 150;
    levelText.y = 10;

    levelLabels[id] = levelText;

    // 💰 accumulated badge
    const cashText = new PIXI.Text("", {
      fill: 0x000000,
      fontSize: 16,
      fontWeight: "bold",
    });

    cashText.anchor.set(0.5);
    cashText.x = 80;
    cashText.y = -15;
    cashText.visible = false;

    cashLabels[id] = cashText;

    container.addChild(building, text, levelText, cashText);
    container.x = x;
    container.y = app.screen.height - 370;

    app.stage.addChild(container);
    buildingsMap[id] = container;
  }

  // HUD
  createHUD(app);

  // Buildings
  createBuilding(80, "Boutique", 0xff4da6, "boutique");
  createBuilding(280, "📸 Influencer", 0x6c5ce7, "influencer");
  createBuilding(480, "🧵 Atelier", 0x00b894, "atelier");

  function updateVisibility() {
    store.buildings.forEach(b => {
      const container = buildingsMap[b.id];
      if (!container) return;
      container.alpha = b.unlocked ? 1 : 0.35;
    });
  }

  updateVisibility();

  // ⏱ GLOBAL GAME LOOP
  let lastTime = performance.now();

  app.ticker.add(() => {
    const now = performance.now();
    const delta = (now - lastTime) / 1000;
    lastTime = now;

    // actualizar economía
    updateBuildings(delta);

    store.buildings.forEach(b => {
      const badge = cashLabels[b.id];
      const level = levelLabels[b.id];
      const container = buildingsMap[b.id];

      if (!badge || !level || !container) return;

      // update level
      level.text = `Lv.${b.level}`;

      // update accumulated badge
      const amount = Math.floor(b.accumulated ?? 0);

      if (amount > 0) {
        if (badge.text !== `💰 ${amount}`) {
          // animación suave
          badge.scale.set(1.4);
          setTimeout(() => badge.scale.set(1), 120);
        }

        badge.text = `💰 ${amount}`;
        badge.visible = true;
      } else {
        badge.visible = false;
      }

      // glow cuando hay dinero
      if (b.id === "boutique" && amount > 0) {
        container.scale.set(1.03);
      } else {
        container.scale.set(1);
      }
    });
  });
}