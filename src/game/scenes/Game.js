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
    const mapWidth = 3200;
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
    console.log("Trigger:", obj.name, obj.x, obj.y, obj.width, obj.height);

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
    }
  }
}
