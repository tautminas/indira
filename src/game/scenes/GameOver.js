import { Scene } from "phaser";

export class GameOver extends Scene {
  constructor() {
    super("GameOver");
  }

  create() {
    this.add.image(0, 0, "background").setOrigin(0, 0).setScale(0.5);

    this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0xffffff, 0.1)
      .setOrigin(0, 0);

    this.add
      .text(
        this.scale.width / 2,
        150,
        "Game Over! You have lost all your lives.",
        {
          fontFamily: "Fredoka-SemiBold",
          fontSize: "30px",
          color: "#ffbe2c",
          stroke: "#2f0c1d",
          strokeThickness: 4,
        },
      )
      .setOrigin(0.5);

    this.input.keyboard.on("keydown-ESC", () => {
      this.scene.start("MainMenu");
    });

    this.createRoundedButton(this.scale.width / 2, 550, "Back to Menu", () => {
      this.scene.start("MainMenu");
    });

    this.input.keyboard.once("keyup-ENTER", () => {
      this.input.keyboard.once("keydown-ENTER", () => {
        this.scene.start("MainMenu");
      });
    });

    this.input.keyboard.once("keydown-ESC", () => {
      this.scene.start("MainMenu");
    });
  }

  createRoundedButton(x, y, text, callback) {
    const buttonText = this.add
      .text(0, 0, text, {
        fontSize: "28px",
        fontFamily: "Fredoka-Bold",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    const paddingX = 16;
    const paddingY = 10;
    const radius = 12;

    const width = buttonText.width + paddingX * 2;
    const height = buttonText.height + paddingY * 2;

    const buttonBg = this.add.graphics();

    buttonBg.fillStyle(0x080c1a, 1);
    buttonBg.fillRoundedRect(-width / 2, -height / 2, width, height, radius);

    const button = this.add.container(x, y, [buttonBg, buttonText]);

    button.setSize(width, height);
    button.setInteractive({
      useHandCursor: true,
    });

    button.on("pointerover", () => {
      buttonBg.clear();
      buttonBg.fillStyle(0x4a193a, 1);
      buttonBg.fillRoundedRect(-width / 2, -height / 2, width, height, radius);
      buttonText.setColor("#ffffff");
    });

    button.on("pointerout", () => {
      buttonBg.clear();
      buttonBg.fillStyle(0x080c1a, 1);
      buttonBg.fillRoundedRect(-width / 2, -height / 2, width, height, radius);
      buttonText.setColor("#ffffff");
    });

    button.on("pointerdown", callback);

    return button;
  }
}
