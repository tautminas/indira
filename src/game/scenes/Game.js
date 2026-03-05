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

    this.player = new Player(this, 100, 50).setScale(0.15);
    // this.player = this.physics.add.sprite(100, 50, "cat").setScale(0.15);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, platforms);

    this.playerSpeed = 200;

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    const { left, right } = this.cursors;
    if (left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
    } else if (right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
    } else {
      this.player.setVelocityX(0);
    }
  }
}
