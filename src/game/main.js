import { Boot } from "./scenes/Boot";
import { Game as MainGame } from "./scenes/Game";
import { GameOver } from "./scenes/GameOver";
import { GameVictory } from "./scenes/GameVictory";
import { Credits } from "./scenes/Credits";
import { Info } from "./scenes/Info";
import { MainMenu } from "./scenes/MainMenu";
import { Preloader } from "./scenes/Preloader";
import { AUTO, Game } from "phaser";

const config = {
  type: AUTO,
  width: 1280,
  height: 720,
  parent: "game-container",
  backgroundColor: "#028af8",
  scale: {
    // mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      // gravity: { y: 300 },
      // debug: true,
    },
  },
  scene: [
    Boot,
    Preloader,
    MainMenu,
    Info,
    Credits,
    MainGame,
    GameOver,
    GameVictory,
  ],
};

const StartGame = (parent) => {
  return new Game({ ...config, parent });
};

export default StartGame;
