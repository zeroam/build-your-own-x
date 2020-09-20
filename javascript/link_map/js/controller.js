const Controller = function () {
  this.down = new Controller.ButtonInput();
  this.left = new Controller.ButtonInput();
  this.right = new Controller.ButtonInput();
  this.up = new Controller.ButtonInput();
  this.space = new Controller.ButtonInput();

  this.keyDownUp = function (type, code) {
    var down = type === "keydown" ? true : false;

    switch (code) {
      case 32:
        this.space.getInput(down);
        break; // space
      case 37:
        this.left.getInput(down);
        break; // left
      case 38:
        this.up.getInput(down);
        break; // up
      case 39:
        this.right.getInput(down);
        break; // right
      case 40:
        this.down.getInput(down);
        break; // down
    }

    console.log(code);
  };
};

Controller.prototype = {
  constructor: Controller,
};

Controller.ButtonInput = function () {
  this.active = false;
  this.down = false;
};

Controller.ButtonInput.prototype = {
  constructor: Controller.ButtonInput,

  getInput: function (down) {
    if (this.down !== down) {
      this.active = down;
    }
    this.down = down;
  },
};
