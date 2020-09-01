window.addEventListener("load", function(event) {
    "use strict";

    // FUNCTIONS //
    // Controller의 keyDownUpHandler가 main으로 이동
    var keyDownUp = function(event) {
        controller.keyDownUp(event.type, event.keyCode);
    }

    // Display의 resizeHandler가 main으로 이동
    var resize = function(event) {
        display.resize(document.documentElement.clientWidth - 32, document.documentElement.clientHeight - 32, game.world.height / game.world.width);
        display.render();
    }

    var render = function() {
        display.fill(game.world.background_color);  // Clear background to game's background color
        display.drawRectangle(game.world.player.x, game.world.player.y, game.world.player.width, game.world.player.height, game.world.player.color);
        display.render();
    };

    var update = function() {
        if (controller.left.active) {
            game.world.player.moveLeft();
        }
        if (controller.right.active) {
            game.world.player.moveRight();
        }
        if (controller.up.active) {
            game.world.player.jump();
            controller.up.active = false;
        }

        game.update();
    }


    // OBJECTS //
    var controller = new Controller();
    var display = new Display(document.querySelector("canvas"));
    var game = new Game();
    var engine = new Engine(1000/30, render, update);


    // INITIALIZE //
    // game의 world 사이즈를 display가 알 수 있도록 적용
    display.buffer.canvas.height = game.world.height;
    display.buffer.canvas.width = game.world.width;

    window.addEventListener("keydown", keyDownUp);
    window.addEventListener("keyup", keyDownUp);
    window.addEventListener("resize", resize);

    resize();

    engine.start();
});