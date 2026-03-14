import Phaser from "phaser";

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "player");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.init();
    this.initEvents();
  }

  init() {
    this.gravity = 500;
    this.playerSpeed = 200;
    this.cursors = this.scene.input.keyboard.createCursorKeys();

    this.body.setGravityY(this.gravity);
    this.setCollideWorldBounds(true);
    this.scene.anims.create({
      key: "idle",
      frames: this.scene.anims.generateFrameNumbers("player", {
        start: 0,
        end: 1,
      }),
      frameRate: 2,
      repeat: -1,
    });
  }

  initEvents() {
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
  }

  update(time, delta) {
    const { left, right, space, up } = this.cursors;
    const onFloor = this.body.onFloor();

    if (left.isDown) {
      this.setVelocityX(-this.playerSpeed);
    } else if (right.isDown) {
      this.setVelocityX(this.playerSpeed);
    } else {
      this.setVelocityX(0);
    }

    if ((space.isDown || up.isDown) && onFloor) {
      this.setVelocityY(-this.playerSpeed * 1.5);
    }

    this.play("idle", true);
  }
}

export default Player;
