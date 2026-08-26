import Phaser from "phaser";
import initAnimations from "./playerAnims";
import collidable from "../mixins/collidable";

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "player");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    Object.assign(this, collidable); // Mixin

    this.init();
    this.initEvents();
  }

  init() {
    this.gravity = 2200;
    this.playerSpeed = 350;
    this.jumpSpeed = 750;
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.escKey = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ESC,
    );

    this.body.setGravityY(this.gravity);
    this.setCollideWorldBounds(true);
    initAnimations(this.scene.anims);
  }

  initEvents() {
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
  }

  update(time, delta) {
    if (!this.body) return;

    const { left, right, space, up } = this.cursors;
    const onFloor = this.body.onFloor();

    if (Phaser.Input.Keyboard.JustDown(this.escKey) && onFloor) {
      this.scene.scene.start("MainMenu");
      return;
    }

    if (left.isDown) {
      this.setVelocityX(-this.playerSpeed);
      this.setFlipX(true);
    } else if (right.isDown) {
      this.setVelocityX(this.playerSpeed);
      this.setFlipX(false);
    } else {
      this.setVelocityX(0);
    }

    if ((space.isDown || up.isDown) && onFloor) {
      this.setVelocityY(-this.jumpSpeed);
    }

    onFloor
      ? this.body.velocity.x !== 0
        ? this.play("run", true)
        : this.play("idle", true)
      : this.play("jump", true);
  }
}

export default Player;
