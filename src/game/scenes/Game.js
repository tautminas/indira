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
    const playerZonesLayer = map.getObjectLayer("player_zones");
    const playerZones = this.getPlayerZones(playerZonesLayer);
    platforms.setCollisionByExclusion(-1, true);

    const trigger1 = map.getObjectLayer("trigger1").objects[0];
    const trap1 = map.createLayer("trap1", tileset, 0, 0);
    console.log(
      "Trigger 1:",
      trigger1.x,
      trigger1.y,
      trigger1.width,
      trigger1.height,
    );
    const trap1Sprite = this.physics.add
      .sprite(
        trigger1.x + trigger1.width,
        trigger1.y + trigger1.height,
        "trap1",
      )
      .setOrigin(1, 1)
      .setAlpha(0);
    trap1Sprite.setDisplaySize(trigger1.width, trigger1.height);

    const player = this.createPlayer(playerZones.start);
    const trap1Overlap = this.physics.add.overlap(player, trap1Sprite, () => {
      trap1Overlap.active = false;
      console.log("Player triggered trap 1!");
    });
    // this.physics.add.collider(player, platforms);
    // player.addCollider(platforms);
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
}
