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
    const dropTrap = map.createLayer("drop", tileset, 0, 0);
    const spikesTrap = map.createLayer("spikes", tileset, 0, 0);
    const holeTrap = map.createLayer("hole", tileset, 0, 0);
    const platformTrap = map.createLayer("platform", tileset, 0, 0);
    const separation1Trap = map.createLayer("separation1", tileset, 0, 0);
    const separation2Trap = map.createLayer("separation2", tileset, 0, 0);
    const dropdown1Trap = map.createLayer("dropdown1", tileset, 0, 0);
    const dropdown2Trap = map.createLayer("dropdown2", tileset, 0, 0);
    const dropdown3Trap = map.createLayer("dropdown3", tileset, 0, 0);
    const falldown1Trap = map.createLayer("falldown1", tileset, 0, 0);
    const falldown2Trap = map.createLayer("falldown2", tileset, 0, 0);
    const falldown3Trap = map.createLayer("falldown3", tileset, 0, 0);
    const skyrocketTrap = map.createLayer("skyrocket", tileset, 0, 0);
    const playerZonesLayer = map.getObjectLayer("player_zones");
    const playerZones = this.getPlayerZones(playerZonesLayer);
    platforms.setCollisionByExclusion(-1, true);
    const player = this.createPlayer(playerZones.start);
    this.createTriggers(map, player);
    this.createPlayerColliders(player, {
      colliders: {
        platformsColliders: platforms,
      },
    });
    this.createEndOfLevel(playerZones.end, player);
    this.setupFollowupCameraOn(player);
  }

  createPlayer(start) {
    return new Player(this, start.x, start.y).setScale(0.1);
  }

  createPlayerColliders(player, { colliders }) {
    player.addCollider(colliders.platformsColliders);
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
        console.log("Player triggered drop trap!");
        break;
      case "spikesTrigger":
        console.log("Player triggered spikes trap!");
        break;
      case "holeTrigger":
        console.log("Player triggered hole trap!");
        break;
      case "platformTrigger":
        console.log("Player triggered platform trap!");
        break;
      case "separationTrigger":
        console.log("Player triggered separation trap!");
        break;
      case "skyrocketTrigger":
        console.log("Player triggered skyrocket trap!");
        break;
      case "textTrigger":
        console.log("Player triggered text trap!");
        break;
    }
  }
}
