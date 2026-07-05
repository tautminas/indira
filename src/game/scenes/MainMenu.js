import { Scene } from "phaser";

export class MainMenu extends Scene {
  constructor() {
    super("MainMenu");

    this.selectedIndex = 0;
    this.menuItems = [];
  }

  create() {
    this.menuItems = [];
    this.selectedIndex = 0;
    this.add.image(620, 220, "logo");

    const style = {
      fontFamily: "Arial Black",
      fontSize: "32px",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 6,
    };

    const hoverStyle = {
      fontFamily: "Arial Black",
      fontSize: "32px",
      color: "#ffff00",
      stroke: "#000000",
      strokeThickness: 6,
    };

    const options = [
      {
        text: "Play",
        action: () => {
          const lives = parseInt(localStorage.getItem("lives")) || 9;

          if (lives === 9) {
            this.scene.start("GameStart");
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

    const startY = 360;
    const spacing = 60;

    options.forEach((option, index) => {
      const button = this.add
        .text(620, startY + index * spacing, option.text, style)
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
