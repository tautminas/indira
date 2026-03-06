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
    this.physics.add.collider(player, platforms);
  }

  createPlayer() {
    return new Player(this, 100, 50).setScale(0.15);
  }
}
