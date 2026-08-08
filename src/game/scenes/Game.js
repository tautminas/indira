import { Scene } from "phaser";
import Player from "../entities/Player";

export class Game extends Scene {
  constructor() {
    super("Game");
  }

  create() {
    for (let i = 0; i < 5; i++) {
      this.add
        .image(
          i * this.textures.getFrame("background").width * 0.5,
          0,
          "background",
        )
        .setOrigin(0, 0)
        .setScale(0.5);
    }

    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("tileset");
    const platforms = map.createLayer("platforms", tileset, 0, 0);

    this.dropTrap = map.createLayer("drop", tileset, 0, 0);
    this.spikesTrap = map.createLayer("spikes", tileset, 0, 0);
    this.holeTrap = map.createLayer("hole", tileset, 0, 0);
    this.platformTrap = map.createLayer("platform", tileset, 0, 0);
    this.platformTrapTriggered = false;
    this.separation1Trap = map.createLayer("separation1", tileset, 0, 0);
    this.separation2Trap = map.createLayer("separation2", tileset, 0, 0);
    this.dropdown1Trap = map.createLayer("dropdown1", tileset, 0, 0);
    this.dropdown1TrapTriggered = false;
    this.dropdown2Trap = map.createLayer("dropdown2", tileset, 0, 0);
    this.dropdown2TrapTriggered = false;
    this.dropdown3Trap = map.createLayer("dropdown3", tileset, 0, 0);
    this.dropdown3TrapTriggered = false;
    this.falldown1Trap = map.createLayer("falldown1", tileset, 0, 0);
    this.falldown1TrapTriggered = false;
    this.falldown2Trap = map.createLayer("falldown2", tileset, 0, 0);
    this.falldown2TrapTriggered = false;
    this.falldown3Trap = map.createLayer("falldown3", tileset, 0, 0);
    this.falldown3TrapTriggered = false;
    this.skyrocketTrap = map.createLayer("skyrocket", tileset, 0, 0);

    const playerZonesLayer = map.getObjectLayer("player_zones");
    const playerZones = this.getPlayerZones(playerZonesLayer);
    platforms.setCollisionByExclusion(-1, true);

    this.dropTrap.setCollisionByExclusion(-1, true);
    this.spikesTrap.setCollisionByExclusion(-1, true);
    this.holeTrap.setCollisionByExclusion(-1, true);
    this.platformTrap.setCollisionByExclusion(-1, true);
    this.separation1Trap.setCollisionByExclusion(-1, true);
    this.separation2Trap.setCollisionByExclusion(-1, true);
    this.dropdown1Trap.setCollisionByExclusion(-1, true);
    this.dropdown2Trap.setCollisionByExclusion(-1, true);
    this.dropdown3Trap.setCollisionByExclusion(-1, true);
    this.falldown1Trap.setCollisionByExclusion(-1, true);
    this.falldown2Trap.setCollisionByExclusion(-1, true);
    this.falldown3Trap.setCollisionByExclusion(-1, true);
    this.skyrocketTrap.setCollisionByExclusion(-1, true);

    this.lives = parseInt(localStorage.getItem("lives")) || 9;
    this.isGameOver();
    this.createLivesDisplay();

    this.player = this.createPlayer(playerZones.start);
    this.createTriggers(map, this.player);
    this.createPlayerColliders(this.player, {
      colliders: {
        platformsColliders: platforms,
        dropTrapColliders: this.dropTrap,
        spikeTrapColliders: this.spikesTrap,
        holeTrapColliders: this.holeTrap,
        platformTrapColliders: this.platformTrap,
        separation1TrapColliders: this.separation1Trap,
        separation2TrapColliders: this.separation2Trap,
        dropdown1TrapColliders: this.dropdown1Trap,
        dropdown2TrapColliders: this.dropdown2Trap,
        dropdown3TrapColliders: this.dropdown3Trap,
        falldown1TrapColliders: this.falldown1Trap,
        falldown2TrapColliders: this.falldown2Trap,
        falldown3TrapColliders: this.falldown3Trap,
        skyrocketTrapColliders: this.skyrocketTrap,
      },
    });
    this.createEndOfLevel(playerZones.end, this.player);
    this.createDeathZone(this.player);
    this.createDogDisplay(this.player);
    this.setupFollowupCameraOn(this.player);
  }

  update() {
    this.checkPlatformTrapOverlap();
  }

  createLivesDisplay() {
    this.add
      .text(20, 30, "Lives:", {
        fontSize: "30px",
        color: "#ffffff",
        fontFamily: "Arial",
      })
      .setScrollFactor(0, 0);

    this.hearts = [];
    for (let i = 0; i < 9; i++) {
      const heart = this.add
        .image(130 + i * 45, 47, i < this.lives ? "heart" : "heartbreak")
        .setScale(0.2)
        .setScrollFactor(0, 0);
      this.hearts.push(heart);
    }
  }

  createDogDisplay(player) {
    this.add.image(1200, 100, "dog").setScale(0.25).setScrollFactor(0, 0);

    this.dialogImage = this.add
      .sprite(993, 90, "dialog")
      .setScale(0.22)
      .setScrollFactor(0, 0);
    this.dialogText = this.add
      .text(900, 75, "Good luck!", {
        fontSize: "30px",
        color: "#ffffff",
        fontFamily: "Arial",
      })
      .setScrollFactor(0, 0)
      .setDepth(2);
  }

  createPlayer(start) {
    return new Player(this, start.x, start.y).setScale(0.1).setDepth(10);
  }

  createPlayerColliders(player, { colliders }) {
    player
      .addCollider(colliders.platformsColliders)
      .addCollider(colliders.dropTrapColliders)
      .addCollider(
        colliders.spikeTrapColliders,
        this.handleTrapCollision.bind(this),
      )
      .addCollider(colliders.holeTrapColliders)
      .addCollider(colliders.platformTrapColliders)
      .addCollider(colliders.separation1TrapColliders)
      .addCollider(colliders.separation2TrapColliders)
      .addCollider(
        colliders.dropdown1TrapColliders,
        this.handleDropdown1TrapCollision.bind(this),
      )
      .addCollider(
        colliders.dropdown2TrapColliders,
        this.handleDropdown2TrapCollision.bind(this),
      )
      .addCollider(
        colliders.dropdown3TrapColliders,
        this.handleDropdown3TrapCollision.bind(this),
      )
      .addCollider(
        colliders.falldown1TrapColliders,
        this.handleFalldown1TrapCollision.bind(this),
      )
      .addCollider(
        colliders.falldown2TrapColliders,
        this.handleFalldown2TrapCollision.bind(this),
      )
      .addCollider(
        colliders.falldown3TrapColliders,
        this.handleFalldown3TrapCollision.bind(this),
      )
      .addCollider(
        colliders.skyrocketTrapColliders,
        this.handleTrapCollision.bind(this),
      );
  }

  handleTrapCollision() {
    this.lives--;
    localStorage.setItem("lives", this.lives);
    if (!this.isGameOver()) {
      this.scene.restart();
    }
  }

  isGameOver() {
    if (this.lives <= 0) {
      this.scene.start("GameOver");
      return true;
    }
    return false;
  }

  setupFollowupCameraOn(player) {
    const height = this.game.config.height;
    const width = this.game.config.width;
    const mapWidth = 6400; // Shouldn't be hardcoded
    const mapOffset = mapWidth > width ? mapWidth - width : 0;
    const zoomFactor = 1;
    const jumpHeadroom = 100;
    this.physics.world.setBounds(
      0,
      -jumpHeadroom,
      width + mapOffset,
      height + 200,
    );
    this.cameras.main
      .setBounds(0, 0, width + mapOffset, height)
      .setZoom(zoomFactor);
    this.cameras.main.startFollow(player);
  }

  getPlayerZones(playerZonesLayer) {
    const playerZones = playerZonesLayer.objects;
    return {
      start: playerZones.find((zone) => zone.name === "startZone"),
      end: playerZones.find((zone) => zone.name === "endZone"),
    };
  }

  createEndOfLevel(end, player) {
    const endOfLevel = this.physics.add
      .sprite(end.x, end.y, "end")
      .setAlpha(0)
      .setSize(5, 200)
      .setOrigin(0.5, 1);
    const eolOverlap = this.physics.add.overlap(player, endOfLevel, () => {
      eolOverlap.active = false;
      console.log("Payer has won!");
    });
  }

  createDeathZone(player) {
    const deathZone = this.physics.add
      .sprite(0, 700, "deathZone")
      .setAlpha(0)
      .setSize(12800, 10)
      .setOrigin(0);

    const deathZoneOverlap = this.physics.add.overlap(player, deathZone, () => {
      deathZoneOverlap.active = false;
      this.handleTrapCollision();
    });
  }

  createTriggers(map, player) {
    const triggers = map.getObjectLayer("triggers").objects;
    triggers.forEach((obj) => this.createTrigger(obj, player));
  }

  createTrigger(obj, player) {
    const triggerSprite = this.physics.add
      .sprite(obj.x + obj.width, obj.y + obj.height, "drop")
      .setOrigin(1, 1)
      .setAlpha(0);

    triggerSprite.setDisplaySize(obj.width, obj.height);

    this.physics.add.overlap(player, triggerSprite, () => {
      this.handleTrigger(obj.name);
      triggerSprite.destroy();
    });
  }

  handleTrigger(name) {
    switch (name) {
      case "dropTrigger":
        this.tweens.add({
          targets: this.dropTrap,
          y: this.dropTrap.y + 350,
          duration: 250,
          ease: "Linear",
        });
        break;
      case "spikesTrigger":
        this.tweens.add({
          targets: this.spikesTrap,
          x: this.spikesTrap.x + 100,
          duration: 100,
          ease: "Linear",
        });
        break;
      case "holeTrigger":
        this.tweens.add({
          targets: this.holeTrap,
          y: this.holeTrap.y + 400,
          duration: 275,
          ease: "Linear",
        });
        break;
      case "platformTrigger":
        this.tweens.add({
          targets: this.platformTrap,
          y: this.platformTrap.y + 96,
          duration: 350,
          ease: "Quad.easeIn",
        });
        break;
      case "separationTrigger":
        this.tweens.add({
          targets: this.separation1Trap,
          x: this.separation1Trap.x - 75,
          duration: 70,
          ease: "Linear",
        });
        this.tweens.add({
          targets: this.separation2Trap,
          x: this.separation2Trap.x + 75,
          duration: 70,
          ease: "Linear",
        });
        break;
      case "skyrocketTrigger":
        this.tweens.add({
          targets: this.skyrocketTrap,
          y: this.skyrocketTrap.y - 100,
          duration: 100,
          delay: 100,
          ease: "Linear",
        });
        break;
      case "textTrigger":
        this.physics.add.existing(this.dialogImage);
        const camera = this.cameras.main;
        this.dialogImage.setPosition(
          this.dialogImage.x + camera.scrollX,
          this.dialogImage.y + camera.scrollY,
        );
        this.dialogImage.setScrollFactor(1);

        this.dialogText.setPosition(
          this.dialogText.x + camera.scrollX,
          this.dialogText.y + camera.scrollY,
        );
        this.dialogText.setScrollFactor(1);

        const dialogOverlap = this.physics.add.overlap(
          this.player,
          this.dialogImage,
          () => {
            dialogOverlap.active = false;
            this.handleTrapCollision(this.player);
          },
        );

        this.tweens.add({
          targets: [this.dialogImage, this.dialogText],
          y: "+=173",
          duration: 500,
          ease: "Linear",
          onComplete: () => {
            dialogOverlap.destroy();

            const { x, y } = this.dialogImage;
            this.dialogImage.destroy();

            this.dialogImage = this.physics.add
              .staticImage(x, y, "dialog")
              .setScale(0.22);

            this.dialogImage.refreshBody();

            this.physics.add.collider(this.player, this.dialogImage);
          },
        });
        break;
    }
  }

  checkPlatformTrapOverlap() {
    if (!this.player || !this.platformTrap) return;

    const playerBounds = this.player.getBounds();

    const tiles = this.platformTrap.getTilesWithinWorldXY(
      this.player.x - 16,
      this.player.y - 16,
      32,
      32,
    );

    const isOverlapping = tiles.some((tile) => {
      if (tile.index === -1) return false;

      const tileRect = new Phaser.Geom.Rectangle(
        tile.getLeft(),
        tile.getTop(),
        tile.width,
        tile.height,
      );

      return Phaser.Geom.Intersects.RectangleToRectangle(
        playerBounds,
        tileRect,
      );
    });

    if (isOverlapping && !this.platformTrapTriggered) {
      this.platformTrapTriggered = true;
      this.handleTrapCollision(this.player);
    }
  }

  handleDropdown1TrapCollision() {
    if (!this.dropdown1TrapTriggered) {
      this.dropdown1TrapTriggered = true;
      this.tweens.add({
        targets: this.dropdown1Trap,
        y: this.dropdown1Trap.y + 280,
        delay: 500,
        duration: 200,
      });
    }
  }

  handleDropdown2TrapCollision() {
    this.handleDropdown3TrapCollision();
    if (!this.dropdown2TrapTriggered) {
      this.dropdown2TrapTriggered = true;
      this.tweens.add({
        targets: this.dropdown2Trap,
        y: this.dropdown2Trap.y - 262,
        duration: 400,
        delay: 1000,
        ease: "Linear",
      });
    }
  }

  handleDropdown3TrapCollision() {
    if (!this.dropdown3TrapTriggered) {
      this.dropdown3TrapTriggered = true;
      this.tweens.add({
        targets: this.dropdown3Trap,
        y: this.dropdown3Trap.y + 400,
        delay: 500,
        duration: 200,
      });
    }
  }

  handleFalldown1TrapCollision() {
    if (!this.falldown1TrapTriggered) {
      this.falldown1TrapTriggered = true;
      this.tweens.add({
        targets: this.falldown1Trap,
        y: this.falldown1Trap.y + 400,
        delay: 250,
        duration: 200,
      });
    }
  }

  handleFalldown2TrapCollision() {
    this.handleFalldown3TrapCollision();
    if (!this.falldown2TrapTriggered) {
      this.falldown2TrapTriggered = true;
      this.tweens.add({
        targets: this.falldown2Trap,
        x: this.falldown2Trap.x + 200,
        duration: 800,
        delay: 1000,
      });
    }
  }

  handleFalldown3TrapCollision() {
    if (!this.falldown3TrapTriggered) {
      this.falldown3TrapTriggered = true;
      this.tweens.add({
        targets: this.falldown3Trap,
        y: this.falldown3Trap.y + 400,
        duration: 200,
        delay: 250,
      });
    }
  }
}
