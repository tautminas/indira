import { Scene } from "phaser";
import Player from "../entities/Player";

export class Game extends Scene {
  constructor() {
    super("Game");
  }

  create() {
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("32x32-tile");

    const platforms = map.createLayer("Tile Layer 1", tileset, 21, 21);
    platforms.setCollisionByExclusion(-1, true);

    const player = this.createPlayer();
    // this.physics.add.collider(player, platforms);
    // player.addCollider(platforms);
    this.createPlayerColliders(player, {
      colliders: {
        platformsColliders: platforms,
      },
    });

    this.setupFollowupCameraOn(player);
  }

  createPlayer() {
    return new Player(this, 100, 50).setScale(0.15);
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
}
