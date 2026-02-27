import * as PIXI from "pixi.js";
import { useGameStore } from "../store/gameStore";
import { createHUD } from "../game/hud";
import { Ticker } from "pixi.js";

export function createGameScene(app: PIXI.Application) {
  const store = useGameStore();

  const buildingsMap: Record<string, PIXI.Container> = {};
  const cashLabels: Record<string, PIXI.Text> = {};
  const levelLabels: Record<string, PIXI.Text> = {};
  const upgradeLabels: Record<string, PIXI.Text> = {};
  const upgradeButtons: Record<string, PIXI.Graphics> = {};
  const collectButtons: Record<string, PIXI.Graphics> = {};
  const lockOverlays: Record<string, PIXI.Graphics> = {};
  const lockIcons: Record<string, PIXI.Text> = {};

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

  createHUD(app);

  const styleColors: Record<string, number> = {
    classic: 0xff4da6,
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

    container.addChild(building);

    // 🔓 LOCK STATUS
    const lockOverlay = new PIXI.Graphics()
      .beginFill(0x000000, 0.6)
      .drawRoundedRect(0, 0, 160, 220, 20)
      .endFill();

    lockOverlay.visible = false;
    container.addChild(lockOverlay);

    const lockIcon = new PIXI.Text("🔒", {
      fontSize: 40,
    });

    lockIcon.anchor.set(0.5);
    lockIcon.x = 80;
    lockIcon.y = 80;
    lockIcon.visible = false;

    container.addChild(lockIcon);

    lockOverlays[id] = lockOverlay;
    lockIcons[id] = lockIcon;

    building.eventMode = "static";
    building.cursor = "pointer";

    building.on("pointerdown", () => {
      const b = store.buildings.find(b => b.id === id);
      if (!b) return;
      openBuildingModal(id);
    });

    // 🟢 COLLECT BUTTON
    const collectButton = new PIXI.Graphics()
      .beginFill(0x2ecc71)
      .drawRoundedRect(0, 0, 60, 24, 6)
      .endFill();

    collectButton.x = 10;
    collectButton.y = 180;
    collectButton.eventMode = "static";
    collectButton.cursor = "pointer";

    const collectLabel = new PIXI.Text("Collect", {
      fontSize: 12,
      fill: 0xffffff,
    });

    collectLabel.anchor.set(0.5);
    collectLabel.x = 30;
    collectLabel.y = 12;

    collectButton.addChild(collectLabel);
    container.addChild(collectButton);

    collectButtons[id] = collectButton;

    collectButton.on("pointerdown", () => {
      const b = store.buildings.find(b => b.id === id);
      if (!b || !b.unlocked || b.accumulated <= 0) return;

      const collectedAmount = Math.floor(b.accumulated);
      store.collect(id);

      spawnFloatingText(container.x + 80, container.y - 20, collectedAmount);
    });

    // 🔵 UPGRADE BUTTON
    const upgradeButton = new PIXI.Graphics()
      .beginFill(0x3498db)
      .drawRoundedRect(0, 0, 70, 24, 6)
      .endFill();

    upgradeButton.x = 80;
    upgradeButton.y = 180;
    upgradeButton.eventMode = "static";
    upgradeButton.cursor = "pointer";

    const upgradeLabel = new PIXI.Text("", {
      fontSize: 12,
      fill: 0xffffff,
    });

    upgradeLabel.anchor.set(0.5);
    upgradeLabel.x = 35;
    upgradeLabel.y = 12;

    upgradeButton.addChild(upgradeLabel);
    container.addChild(upgradeButton);

    upgradeLabels[id] = upgradeLabel;
    upgradeButtons[id] = upgradeButton;

    upgradeButton.on("pointerdown", () => {
      const b = store.buildings.find(b => b.id === id);
      if (!b || !b.unlocked) return;

      const cost = store.getUpgradeCost(b);
      if (store.money < cost) return;

      store.upgrade(id);
    });

    // 🏷 NAME
    const nameText = new PIXI.Text(name, {
      fill: 0xffffff,
      fontSize: 14,
      align: "center",
      wordWrap: true,
      wordWrapWidth: 140,
    });

    nameText.anchor.set(0.5);
    nameText.x = 80;
    nameText.y = 120;

    container.addChild(nameText);

    // 🏷 LEVEL / LOCK
    const levelText = new PIXI.Text("", {
      fontSize: 12,
      fill: 0xffffff,
    });

    levelText.anchor.set(1);
    levelText.x = 150;
    levelText.y = 10;

    container.addChild(levelText);
    levelLabels[id] = levelText;

    // 💰 ACCUMULATED BADGE
    const cashText = new PIXI.Text("", {
      fill: 0x000000,
      fontSize: 16,
      fontWeight: "bold",
    });

    cashText.anchor.set(0.5);
    cashText.x = 80;
    cashText.y = -15;
    cashText.visible = false;

    container.addChild(cashText);
    cashLabels[id] = cashText;

    container.x = x;
    container.y = app.screen.height - 370;

    app.stage.addChild(container);
    buildingsMap[id] = container;
  }

  store.buildings.forEach((b, index) => {
    createBuilding(80 + index * 200, b);
  });

  function updateVisibility() {
    store.buildings.forEach(b => {
      const container = buildingsMap[b.id];
      const level = levelLabels[b.id];
      const upgradeLabel = upgradeLabels[b.id];
      const upgradeButton = upgradeButtons[b.id];
      const collectButton = collectButtons[b.id];
      const lockOverlay = lockOverlays[b.id];
      const lockIcon = lockIcons[b.id];

      if (!container || !level || !upgradeLabel || !upgradeButton || !collectButton) return;

      if (!b.unlocked) {
        container.alpha = 1;
        lockOverlay.visible = true;
        lockIcon.visible = true;
        level.text = `Unlock $${b.unlockCost}`;
        upgradeButton.alpha = 0;
        collectButton.alpha = 0;
      } else {
        lockOverlay.visible = false;
        lockIcon.visible = false;
        level.text = `Lv.${b.level}`;

        const cost = store.getUpgradeCost(b);
        upgradeLabel.text = `Up $${Math.floor(cost)}`;

        upgradeButton.alpha = store.money >= cost ? 1 : 0.5;
        collectButton.alpha = b.accumulated > 0 ? 1 : 0.5;
      }


    });
  }

  app.ticker.add((ticker) => {
    const deltaSeconds = ticker.deltaMS / 1000;
    const autoEvents = store.tick(deltaSeconds);

    autoEvents?.forEach(event => {
      const container = buildingsMap[event.id];
      if (!container) return;

      spawnFloatingText(
        container.x + 80,
        container.y - 20,
        event.amount
      );
    });

    store.buildings.forEach(b => {
      const badge = cashLabels[b.id];
      const container = buildingsMap[b.id];

      if (!badge || !container) return;

      const amount = Math.floor(b.accumulated ?? 0);

      if (amount > 0) {
        badge.text = `💰 ${amount}`;
        badge.visible = true;
      } else {
        badge.visible = false;
      }

      const storageCap = b.storage * b.level;

      if (b.accumulated >= storageCap) {
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
    const duration = 0.8;

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

  function openBuildingModal(id: string) {
    const modal = new PIXI.Container();
    const b = store.buildings.find(b => b.id === id);
    if (!b) return;

    const bg = new PIXI.Graphics()
      .beginFill(0x000000, 0.7)
      .drawRect(0, 0, app.screen.width, app.screen.height)
      .endFill();

    bg.eventMode = "static";
    bg.on("pointerdown", () => {
      app.stage.removeChild(modal);
    });

    // Panel
    const panel = new PIXI.Graphics()
      .beginFill(0xffffff)
      .drawRoundedRect(0, 0, 340, 360, 16)
      .endFill();

    panel.x = app.screen.width / 2 - 170;
    panel.y = app.screen.height / 2 - 180;

    modal.addChild(bg, panel);
    app.stage.addChild(modal);

    // ===== TEXTOS DINÁMICOS =====

    const nameText = new PIXI.Text(b.name, { fill: 0x000000, fontSize: 20 });
    nameText.x = panel.x + 20;
    nameText.y = panel.y + 20;

    const levelText = new PIXI.Text("", { fill: 0x000000, fontSize: 16 });
    levelText.x = panel.x + 20;
    levelText.y = panel.y + 60;

    const productionText = new PIXI.Text("", { fill: 0x000000, fontSize: 16 });
    productionText.x = panel.x + 20;
    productionText.y = panel.y + 90;

    const storageText = new PIXI.Text("", { fill: 0x000000, fontSize: 16 });
    storageText.x = panel.x + 20;
    storageText.y = panel.y + 120;

    const upgradeCostText = new PIXI.Text("", { fill: 0x000000, fontSize: 16 });
    upgradeCostText.x = panel.x + 20;
    upgradeCostText.y = panel.y + 150;

    const autoText = new PIXI.Text("", { fill: 0x000000, fontSize: 16 });
    autoText.x = panel.x + 20;
    autoText.y = panel.y + 180;


    modal.addChild(
      nameText,
      levelText,
      productionText,
      storageText,
      upgradeCostText,
      autoText
    );

    // ===== BOTONES =====

    const actionButton = new PIXI.Graphics();
    actionButton.x = panel.x + 100;
    actionButton.y = panel.y + 260;

    const buttonLabel = new PIXI.Text("", {
      fill: 0xffffff,
      fontSize: 16,
    });

    buttonLabel.anchor.set(0.5);
    buttonLabel.x = 70;
    buttonLabel.y = 22;

    actionButton.addChild(buttonLabel);
    modal.addChild(actionButton);

    // ===== UPDATE LOOP =====

    function updateModal() {
      const b = store.buildings.find(b => b.id === id);
      if (!b) return;

      actionButton.removeAllListeners();

      if (!b.unlocked) {
        levelText.text = "Locked";
        productionText.text = "";
        storageText.text = "";
        upgradeCostText.text = `Unlock cost: $${b.unlockCost}`;
        autoText.text = "";

        actionButton.clear();
        actionButton.beginFill(
          store.money >= b.unlockCost ? 0x2ecc71 : 0x999999
        );
        actionButton.drawRoundedRect(0, 0, 140, 44, 10);
        actionButton.endFill();

        buttonLabel.text = "Unlock";

        if (store.money >= b.unlockCost) {
          actionButton.eventMode = "static";
          actionButton.cursor = "pointer";
          actionButton.once("pointerdown", () => {
            store.unlock(id);
          });
        }

        return;
      }

      // ===== UNLOCKED =====

      levelText.text = `Level: ${b.level}`;

      const productionPerSecond = b.baseProduction * b.level;
      productionText.text = `Production/s: ${productionPerSecond}`;

      storageText.text = `Storage: ${Math.floor(b.storage)}`;

      const upgradeCost = store.getUpgradeCost(b);
      upgradeCostText.text = `Upgrade cost: $${upgradeCost}`;

      autoText.text = `Auto-collect: ${b.autoCollectUnlocked ? "ON" : "OFF"}`;

      actionButton.clear();
      actionButton.beginFill(
        store.money >= upgradeCost ? 0x3498db : 0x999999
      );
      actionButton.drawRoundedRect(0, 0, 140, 44, 10);
      actionButton.endFill();

      buttonLabel.text = "Upgrade";

      if (store.money >= upgradeCost) {
        actionButton.eventMode = "static";
        actionButton.cursor = "pointer";
        actionButton.once("pointerdown", () => {
          store.upgrade(id);
        });
      }
    }

    updateModal();

    // Update
    const tickerFn = () => {
      updateModal();
    };

    app.ticker.add(tickerFn);

    // Cleanup
    bg.on("pointerdown", () => {
      app.ticker.remove(tickerFn);
      app.stage.removeChild(modal);
    });
  }
}

