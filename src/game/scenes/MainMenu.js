import { Scene } from "phaser";

export class MainMenu extends Scene {
  constructor() {
    super("MainMenu");

    this.selectedIndex = 0;
    this.menuItems = [];
  }

  create() {
    this.music = this.sound.get("soundtrack");
    if (!this.music) {
      this.music = this.sound.add("soundtrack", { loop: true, volume: 0.5 });
    }
    if (!this.music.isPlaying) {
      this.music.play();
    }

    this.menuItems = [];
    this.selectedIndex = 0;

    this.backgroundScale = 0.5;
    this.background1 = this.add
      .image(0, 0, "background")
      .setOrigin(0, 0)
      .setScale(this.backgroundScale);
    this.background2 = this.add
      .image(this.background1.displayWidth, 0, "background")
      .setOrigin(0, 0)
      .setScale(this.backgroundScale);
    this.scrollSpeed = 20;

    this.add.image(this.scale.width / 2, 160, "cat").setScale(0.4);
    this.add
      .text(this.scale.width / 2, 350, "Indira", {
        fontFamily: "Fredoka-Bold",
        fontSize: "145px",
        color: "#ffbe2c",
        stroke: "#ffa214",
        strokeThickness: 1,
      })
      .setOrigin(0.5);

    const style = {
      fontFamily: "Fredoka-SemiBold",
      fontSize: "32px",
      color: "#ffffff",
      stroke: "#2f0c1d",
      strokeThickness: 6,
    };

    const hoverStyle = {
      fontFamily: "Fredoka-SemiBold",
      fontSize: "32px",
      color: "#eee98a",
      stroke: "#2f0c1d",
      strokeThickness: 6,
    };

    const options = [
      {
        text: "Play",
        action: () => {
          const lives = Phaser.Math.Clamp(
            parseInt(localStorage.getItem("lives")) ?? 9,
            0,
            9,
          );

          if (lives <= 0) {
            this.scene.start("GameOver");
          } else {
            this.scene.start("Game");
          }
        },
      },
      {
        text: "Information",
        action: () => {
          this.scene.start("Info");
        },
      },
      {
        text: "Credits",
        action: () => {
          this.scene.start("Credits");
        },
      },
      {
        text: "Exit",
        action: () => {
          this.game.destroy(true);
        },
      },
    ];

    const startY = 470;
    const spacing = 60;

    options.forEach((option, index) => {
      const button = this.add
        .text(
          this.scale.width / 2,
          startY + index * spacing,
          option.text,
          style,
        )
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

      button.action = option.action;

      button.on("pointerover", () => {
        this.selectedIndex = index;
        this.updateSelection();
      });

      button.on("pointerdown", () => {
        option.action();
      });

      this.menuItems.push(button);
    });

    // Keyboard controls
    this.input.keyboard.on("keydown-UP", () => {
      this.selectedIndex--;

      if (this.selectedIndex < 0) {
        this.selectedIndex = this.menuItems.length - 1;
      }

      this.updateSelection();
    });

    this.input.keyboard.on("keydown-DOWN", () => {
      this.selectedIndex++;

      if (this.selectedIndex >= this.menuItems.length) {
        this.selectedIndex = 0;
      }

      this.updateSelection();
    });

    // WASD support
    this.input.keyboard.on("keydown-W", () => {
      this.selectedIndex--;

      if (this.selectedIndex < 0) {
        this.selectedIndex = this.menuItems.length - 1;
      }

      this.updateSelection();
    });

    this.input.keyboard.on("keydown-S", () => {
      this.selectedIndex++;

      if (this.selectedIndex >= this.menuItems.length) {
        this.selectedIndex = 0;
      }

      this.updateSelection();
    });

    this.input.keyboard.on("keydown-ENTER", () => {
      this.menuItems[this.selectedIndex].action();
    });

    this.input.keyboard.on("keydown-SPACE", () => {
      this.menuItems[this.selectedIndex].action();
    });

    this.normalStyle = style;
    this.hoverStyle = hoverStyle;

    this.updateSelection();
  }

  update(time, delta) {
    const movement = this.scrollSpeed * (delta / 1000);

    this.background1.x -= movement;
    this.background2.x -= movement;

    const width = this.background1.displayWidth;

    if (this.background1.x <= -width) {
      this.background1.x = this.background2.x + width;
    }

    if (this.background2.x <= -width) {
      this.background2.x = this.background1.x + width;
    }
  }

  updateSelection() {
    this.menuItems.forEach((item, index) => {
      if (index === this.selectedIndex) {
        item.setStyle(this.hoverStyle);
        item.setScale(1.15);
      } else {
        item.setStyle(this.normalStyle);
        item.setScale(1);
      }
    });
  }
}
