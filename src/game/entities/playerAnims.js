export default (anims) => {
  anims.create({
    key: "idle",
    frames: anims.generateFrameNumbers("player", { start: 0, end: 1 }),
    frameRate: 2,
    repeat: -1,
  });

  anims.create({
    key: "run",
    frames: anims.generateFrameNumbers("player", { start: 2, end: 3 }),
    frameRate: 2,
    repeat: -1,
  });
};
