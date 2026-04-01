import { Scene } from "phaser";

export class GameOver extends Scene {
  constructor() {
    super("GameOver");
  }

  create() {
    this.cameras.main.setBackgroundColor(0xff0000);

    this.add.image(730, 300, "dog").setScale(0.25).setScrollFactor(0, 0);
    this.add.image(500, 300, "dialog").setScale(0.25).setScrollFactor(0, 0);
    this.dialogText = this.add
      .text(410, 280, "You died!", {
        fontSize: "30px",
        color: "#ffffff",
        fontFamily: "Arial",
      })
      .setScrollFactor(0, 0);
    this.add
      .text(
        150,
        600,
        "You lost you 9 cat lives. You will never get a change to play this game again!\nUnless you know how to open different browser or delete local storage. But you don't, do you?",
        {
          fontSize: "20px",
          color: "#ffffff",
          fontFamily: "Arial",
        },
      )
      .setScrollFactor(0, 0);

    this.input.once("pointerdown", () => {
      this.scene.start("Game");
    });
  }
}
