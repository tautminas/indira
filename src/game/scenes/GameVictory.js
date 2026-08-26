import { Scene } from "phaser";

export class GameVictory extends Scene {
  constructor() {
    super("GameVictory");
  }

  create() {
    this.backgroundScale = 0.5;
    this.pushAmount = Phaser.Math.Between(0, this.scale.width);
    this.background1 = this.add
      .image(-this.pushAmount, 0, "background")
      .setOrigin(0, 0)
      .setScale(this.backgroundScale);
    this.background2 = this.add
      .image(this.background1.displayWidth - this.pushAmount, 0, "background")
      .setOrigin(0, 0)
      .setScale(this.backgroundScale);

    this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0x5da75d, 0.2)
      .setOrigin(0, 0);

    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2,
        "You made it through the obstacle course! Want to go one more time?",
        {
          fontFamily: "Fredoka-SemiBold",
          fontSize: "35px",
          color: "#ffbe2c",
          stroke: "#2f0c1d",
          strokeThickness: 4,
        },
      )
      .setOrigin(0.5);

    this.createRoundedButton(
      this.scale.width / 2,
      (this.scale.height * 3) / 4,
      "Back to Menu",
      () => {
        this.scene.start("MainMenu");
      },
    );

    const enterHandler = (event) => {
      if (event.repeat) return;
      this.input.keyboard.off("keydown-ENTER", enterHandler);
      this.scene.start("MainMenu");
    };
    this.input.keyboard.on("keydown-ENTER", enterHandler);

    const escHandler = (event) => {
      if (event.repeat) return;
      this.input.keyboard.off("keydown-ESC", escHandler);
      this.scene.start("MainMenu");
    };
    this.input.keyboard.on("keydown-ESC", escHandler);
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
