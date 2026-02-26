import * as PIXI from "pixi.js";
import { useGameStore } from "../store/gameStore";
import { createHUD } from "../game/hud";
import { Ticker } from "pixi.js";

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

  // HUD
  createHUD(app);

  // 🎨 Colors by style
  const styleColors: Record<string, number> = {
    clasic: 0xff4da6,
    romantic: 0xff9ff3,
    elegant: 0x2d3436,
  };

  function createBuilding(x: number, buildingData: any) {
    const { id, name } = buildingData;

    const container = new PIXI.Container();

    const building = new PIXI.Graphics()
      .beginFill(styleColors[id] ?? 0xffffff)
      .drawRoundedRect(0, 0, 160, 220, 20)
      .endFill();

    building.eventMode = "static";
    building.cursor = "pointer";

    building.on("pointerdown", () => {
      const b = store.buildings.find(b => b.id === id);
      if (!b) return;

      if (!b.unlocked) {
        store.unlock(id);
        return;
      }

      if (b.accumulated > 0) {
        const collectedAmount = Math.floor(b.accumulated);

        store.collect(id);

        spawnFloatingText(
          container.x + 80,
          container.y - 20,
          collectedAmount
        );
      } else {
        store.upgrade(id);
      }

      container.scale.set(0.92);
      setTimeout(() => container.scale.set(1), 90);
    });

    // Label name
    const text = new PIXI.Text(name, {
      fill: 0xffffff,
      fontSize: 14,
      align: "center",
      wordWrap: true,
      wordWrapWidth: 140,
    });

    text.anchor.set(0.5);
    text.x = 80;
    text.y = 110;

    // Level
    const levelText = new PIXI.Text("", {
      fontSize: 12,
      fill: 0xffffff,
    });

    levelText.anchor.set(1);
    levelText.x = 150;
    levelText.y = 10;

    levelLabels[id] = levelText;

    // 💰 Badge accumulated
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

  // 🏬 Create building from store
  store.buildings.forEach((b, index) => {
    createBuilding(80 + index * 200, b);
  });

  function updateVisibility() {
    store.buildings.forEach(b => {
      const container = buildingsMap[b.id];
      if (!container) return;
      container.alpha = b.unlocked ? 1 : 0.35;
    });
  }

  updateVisibility();

  // ⏱ GAME LOOP
  let lastTime = performance.now();

  app.ticker.add(() => {
    const now = performance.now();
    const delta = (now - lastTime) / 1000;
    lastTime = now;

    store.update(delta);

    store.buildings.forEach(b => {
      const badge = cashLabels[b.id];
      const level = levelLabels[b.id];
      const container = buildingsMap[b.id];

      if (!badge || !level || !container) return;

      level.text = `Lv.${b.level}`;
      const amount = Math.floor(b.accumulated ?? 0);

      if (amount > 0) {
        if (badge.text !== `💰 ${amount}`) {
          badge.scale.set(1.4);
          setTimeout(() => badge.scale.set(1), 120);
        }

        badge.text = `💰 ${amount}`;
        badge.visible = true;
      } else {
        badge.visible = false;
      }

      if (b.accumulated >= b.storage) {
        container.scale.set(1.03);
      } else {
        container.scale.set(1);
      }
    });

    updateVisibility();
  });

  function spawnFloatingText(x: number, y: number, amount: number) {
    const text = new PIXI.Text(`+$${amount}`, {
      fill: 0x2ecc71,
      fontSize: 18,
      fontWeight: "bold",
    });

    text.anchor.set(0.5);
    text.x = x;
    text.y = y;

    app.stage.addChild(text);

    let life = 0;
    const duration = 0.8; // seconds

    const tickerFn = (ticker: Ticker) => {
      const deltaSeconds = ticker.deltaMS / 1000;
      life += deltaSeconds;

      text.y -= 40 * deltaSeconds;
      text.alpha = 1 - life / duration;

      if (life >= duration) {
        app.ticker.remove(tickerFn);
        app.stage.removeChild(text);
        text.destroy();
      }
    };

    app.ticker.add(tickerFn);
  }
}

