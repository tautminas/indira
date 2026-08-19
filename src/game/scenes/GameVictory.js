import { Scene } from "phaser";

export class GameVictory extends Scene {
  constructor() {
    super("GameVictory");
  }

  create() {
    this.cameras.main.setBackgroundColor(0xff0000);

    this.add.image(730, 300, "dog").setScale(0.25).setScrollFactor(0, 0);
    this.add.image(500, 300, "dialog").setScale(0.25).setScrollFactor(0, 0);
    this.dialogText = this.add
      .text(410, 280, "Victory!", {
        fontSize: "30px",
        color: "#ffffff",
        fontFamily: "Arial",
      })
      .setScrollFactor(0, 0);
    this.add
      .text(150, 600, "You won!", {
        fontSize: "20px",
        color: "#ffffff",
        fontFamily: "Arial",
      })
      .setScrollFactor(0, 0);

    this.input.once("pointerdown", () => {
      this.scene.start("Game");
    });
  }
}
