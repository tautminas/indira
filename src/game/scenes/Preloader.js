import { Scene } from "phaser";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  init() {
    const { width, height } = this.scale;
    this.background = this.add
      .image(0, 0, "background")
      .setOrigin(0, 0)
      .setScale(0.5);
    this.add
      .rectangle(width / 2, height / 2, 468, 32)
      .setStrokeStyle(1, 0xffffff);
    const bar = this.add.rectangle(
      width / 2 - 230,
      height / 2,
      4,
      28,
      0xffffff,
    );
    this.load.on("progress", (progress) => {
      bar.width = 4 + 460 * progress;
    });
  }

  preload() {
    this.load.setPath("assets");
    this.load.image("logo", "logo.png");
    this.load.image("tileset", "tileset.png");
    this.load.tilemapTiledJSON("map", "map.tmj");
    this.load.image("cat", "cats/cat.png");
    this.load.image("dog", "dog.png");
    this.load.image("dialog", "dialog.png");
    this.load.image("heart", "heart.png");
    this.load.image("heartbreak", "heartbreak.png");
    this.load.spritesheet("player", "player.png", {
      frameWidth: 735,
      frameHeight: 504,
      spacing: 0,
    });
    this.load.audio("soundtrack", "soundtrack.mp3");
    this.load.font(
      "Fredoka-Regular",
      "fonts/Fredoka/static/Fredoka-Regular.ttf",
    );
    this.load.font(
      "Fredoka-SemiBold",
      "fonts/Fredoka/static/Fredoka-SemiBold.ttf",
    );
    this.load.font("Fredoka-Bold", "fonts/Fredoka/static/Fredoka-Bold.ttf");
  }

  create() {
    this.scene.start("MainMenu");
  }
}
