window.addEventListener("load", function (event) {
  "use strict";

  // FUNCTIONS //
  var keyDownUp = function (event) {
    controller.keyDownUp(event.type, event.keyCode);
  };

  // CLASSES //
  const AssetsManager = function () {
    this.character_image = null;
  };
  AssetsManager.prototype = {
    constructor: AssetsManager,

    requestImage: function (url, callback) {
      let image = new Image();

      image.addEventListener("load", function (e) {
        callback(image);
      });

      image.src = url;
    },
  };

  var resize = function (event) {
    display.resize(
      document.documentElement.clientWidth - 32,
      document.documentElement.clientHeight - 32,
      game.world.height / game.world.width
    );
    display.render();
  };

  var render = function () {
    display.fill(game.world.background_color);

    let image = new Image();
    image.src = "img/basictiles.png";
    display.drawBaseMap(image, 8, game.world.map, 11, 16);
    display.drawMap(image, 8, game.world.map, 16);

    let player = game.world.player;
    let frame = game.world.character_set.frames[player.frame_value];

    display.drawObject(
      assets_manager.character_image,
      frame.x,
      frame.y,
      frame.width + frame.offset_x,
      frame.height + frame.offset_y,
      player.x,
      player.y,
      player.width,
      player.height
    );


    let link_obj = game.world.link_obj;
    frame = game.world.tile_set.frames[link_obj.frame_value];
    display.drawObject(
      image,
      frame.x,
      frame.y,
      frame.width + frame.offset_x,
      frame.height + frame.offset_y,
      link_obj.x,
      link_obj.y,
      link_obj.width,
      link_obj.height
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
      game.world.player.moveDown();
    } else {
      game.world.player.yUp();
    }

    game.update();
  };

  // OBJECTS
  var assets_manager = new AssetsManager();
  var controller = new Controller();
  var display = new Display(document.querySelector("canvas"));
  var game = new Game();
  var engine = new Engine(1000 / 30, render, update);

  // INITIALIZE
  display.buffer.canvas.width = game.world.width;
  display.buffer.canvas.height = game.world.height;

  assets_manager.requestImage("img/characters.png", (image) => {
    assets_manager.character_image = image;

    resize();
    engine.start();
  });

  window.addEventListener("resize", resize);
  window.addEventListener("keydown", keyDownUp);
  window.addEventListener("keyup", keyDownUp);
});
