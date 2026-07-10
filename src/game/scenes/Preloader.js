import { Scene } from "phaser";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  init() {
    this.add.image(512, 384, "background");
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);
    this.load.on("progress", (progress) => {
      bar.width = 4 + 460 * progress;
    });
  }

  preload() {
    this.load.setPath("assets");
    this.load.image("logo", "logo.png");
    this.load.image("tileset", "tileset.png");
    this.load.tilemapTiledJSON("map", "map.tmj");
    this.load.image("cat", "cat.png");
    this.load.image("dog", "dog.png");
    this.load.image("dialog", "dialog.png");
    this.load.image("heart", "heart.png");
    this.load.image("heartbreak", "heartbreak.png");
    this.load.spritesheet("player", "player.png", {
      frameWidth: 687,
      frameHeight: 492,
      spacing: 0,
    });
  }

  create() {
    this.scene.start("Game");
  }
}
