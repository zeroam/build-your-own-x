window.addEventListener("load", function (event) {
  "use strict";

  // FUNCTIONS
  var keyDownUp = function (event) {
    controller.keyDownUp(event.type, event.keyCode);
  };

  var resize = function (event) {
    console.log("resizing");
    display.resize(
      document.documentElement.clientWidth - 32,
      document.documentElement.clientHeight - 32,
      game.world.height / game.world.width
    );
    display.render();
  };

  var render = function () {
    display.fill(game.world.background_color);

    let player = game.world.player;
    let image = new Image();
    image.src = "img/characters.png";
    let frame = game.world.tile_set.frames[player.frame_value];
    display.drawObject(
      image,
      frame.x,
      frame.y,
      frame.width + frame.offset_x,
      frame.height + frame.offset_y,
      player.x,
      player.y,
      player.width,
      player.height
    );
    display.render();
  };

  var update = function () {
    if (controller.left.active) {
      game.world.player.moveLeft();
    } else if (controller.right.active) {
      game.world.player.moveRight();
    } else {
      game.world.player.xUp();
    }

    if (controller.up.active) {
      game.world.player.moveUp();
    } else if (controller.down.active) {
      game.world.player.moveDown()
    } else {
      game.world.player.yUp();
    }

    game.update();
  };

  // OBJECTS
  var controller = new Controller();
  var display = new Display(document.querySelector("canvas"));
  var game = new Game();
  var engine = new Engine(1000 / 30, render, update);

  // INITIALIZE
  display.buffer.canvas.width = game.world.width;
  display.buffer.canvas.height = game.world.height;
  window.addEventListener("resize", resize);
  window.addEventListener("keydown", keyDownUp);
  window.addEventListener("keyup", keyDownUp);

  resize();
  engine.start();
});
