import { Scene } from "phaser";

export class Game extends Scene {
  constructor() {
    super("Game");
  }

  create() {
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("32x32-tile");
    map.createLayer("Tile Layer 1", tileset, 21, 21);
  }
}
