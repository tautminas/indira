import { Scene } from "phaser";

export class MainMenu extends Scene {
  constructor() {
    super("MainMenu");
  }

  create() {
    this.add.image(620, 300, "logo");

    this.add
      .text(620, 460, "Main Menu", {
        fontFamily: "Arial Black",
        fontSize: 38,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5);

    this.input.once("pointerdown", () => {
      const lives = parseInt(localStorage.getItem("lives")) || 9;
      if (lives === 9) {
        this.scene.start("GameStart");
      } else {
        this.scene.start("Game");
      }
    });
  }
}
