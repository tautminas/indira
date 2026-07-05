import { Scene } from "phaser";

export class Info extends Scene {
  constructor() {
    super("Info");
  }

  create() {
    this.cameras.main.setBackgroundColor(0xff0000);

    this.add.image(730, 300, "dog").setScale(0.25);
    this.add.image(500, 300, "dialog").setScale(0.25);

    this.dialogText = this.add.text(410, 280, "Welcome!", {
      fontSize: "30px",
      color: "#ffffff",
      fontFamily: "Arial",
    });

    this.add.text(
      150,
      600,
      "Dogge Info: You have 9 lives. Good luck on your adventure!",
      {
        fontSize: "20px",
        color: "#ffffff",
        fontFamily: "Arial",
      },
    );

    const backButton = this.add
      .text(1180, 670, "Back to Menu", {
        fontSize: "28px",
        fontFamily: "Arial Black",
        color: "#ffffff",
        backgroundColor: "#444444",
        padding: {
          left: 12,
          right: 12,
          top: 8,
          bottom: 8,
        },
      })
      .setOrigin(1, 1)
      .setInteractive({ useHandCursor: true });

    backButton.on("pointerover", () => {
      backButton.setStyle({ backgroundColor: "#666666" });
    });

    backButton.on("pointerout", () => {
      backButton.setStyle({ backgroundColor: "#444444" });
    });

    backButton.on("pointerdown", () => {
      this.scene.start("MainMenu");
    });

    this.input.keyboard.on("keydown-ESC", () => {
      this.scene.start("MainMenu");
    });
  }
}
