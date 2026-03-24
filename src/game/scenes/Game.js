import { Scene } from "phaser";
import Player from "../entities/Player";

export class Game extends Scene {
  constructor() {
    super("Game");
  }

  create() {
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("tileset");
    const platforms = map.createLayer("platforms", tileset, 0, 0);

    this.dropTrap = map.createLayer("drop", tileset, 0, 0);
    this.spikesTrap = map.createLayer("spikes", tileset, 0, 0);
    this.holeTrap = map.createLayer("hole", tileset, 0, 0);
    this.platformTrap = map.createLayer("platform", tileset, 0, 0);
    this.separation1Trap = map.createLayer("separation1", tileset, 0, 0);
    this.separation2Trap = map.createLayer("separation2", tileset, 0, 0);
    this.dropdown1Trap = map.createLayer("dropdown1", tileset, 0, 0);
    this.dropdown2Trap = map.createLayer("dropdown2", tileset, 0, 0);
    this.dropdown3Trap = map.createLayer("dropdown3", tileset, 0, 0);
    this.falldown1Trap = map.createLayer("falldown1", tileset, 0, 0);
    this.falldown2Trap = map.createLayer("falldown2", tileset, 0, 0);
    this.falldown3Trap = map.createLayer("falldown3", tileset, 0, 0);
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
    console.log(`Player has ${this.lives} lives left.`);

    const player = this.createPlayer(playerZones.start);
    this.createTriggers(map, player);
    this.createPlayerColliders(player, {
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
    this.createEndOfLevel(playerZones.end, player);
    this.createDeathZone(player);
    this.setupFollowupCameraOn(player);
  }

  createPlayer(start) {
    return new Player(this, start.x, start.y).setScale(0.1);
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
      .addCollider(
        colliders.platformTrapColliders,
        this.handleTrapCollision.bind(this),
      )
      .addCollider(colliders.separation1TrapColliders)
      .addCollider(colliders.separation2TrapColliders)
      .addCollider(colliders.dropdown1TrapColliders)
      .addCollider(colliders.dropdown2TrapColliders)
      .addCollider(colliders.dropdown3TrapColliders)
      .addCollider(colliders.falldown1TrapColliders)
      .addCollider(colliders.falldown2TrapColliders)
      .addCollider(colliders.falldown3TrapColliders)
      .addCollider(
        colliders.skyrocketTrapColliders,
        this.handleTrapCollision.bind(this),
      );
  }

  handleTrapCollision() {
    this.lives--;
    localStorage.setItem("lives", this.lives);
    this.scene.restart();
  }

  setupFollowupCameraOn(player) {
    const height = this.game.config.height;
    const width = this.game.config.width;
    const mapWidth = 6400; // Shouldn't be hardcoded
    const mapOffset = mapWidth > width ? mapWidth - width : 0;
    const zoomFactor = 1;
    this.physics.world.setBounds(0, 0, width + mapOffset, height + 200);
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
      .setSize(6800, 10)
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
          y: this.dropTrap.y + 300,
          duration: 200,
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
          y: this.holeTrap.y + 300,
          duration: 200,
          ease: "Linear",
        });
        break;
      case "platformTrigger":
        this.tweens.add({
          targets: this.platformTrap,
          y: this.platformTrap.y + 100,
          duration: 75,
          ease: "Linear",
        });
        break;
      case "separationTrigger":
        this.tweens.add({
          targets: this.separation1Trap,
          x: this.separation1Trap.x - 40,
          duration: 25,
          ease: "Linear",
        });
        this.tweens.add({
          targets: this.separation2Trap,
          x: this.separation2Trap.x + 40,
          duration: 25,
          ease: "Linear",
        });
        break;
      case "skyrocketTrigger":
        this.tweens.add({
          targets: this.skyrocketTrap,
          y: this.skyrocketTrap.y - 100,
          duration: 100,
          ease: "Linear",
        });
        break;
      case "textTrigger":
        console.log("Player triggered text trap!");
        break;
    }
  }
}
