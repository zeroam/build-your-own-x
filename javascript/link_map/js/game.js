const Game = function () {
  this.world = new Game.World();
  this.update = function () {
    this.world.update();
  };
};

Game.prototype = {
  constructor: Game,
};

Game.Animator = function (frame_set, delay, mode = "loop") {
  this.count = 0;
  this.delay = delay >= 1 ? delay : 1;
  this.frame_set = frame_set;
  this.frame_index = 0;
  this.frame_value = frame_set[this.frame_index];
  this.mode = mode;
};
Game.Animator.prototype = {
  constructor: Game.Animator,

  animate: function () {
    switch (this.mode) {
      case "loop":
        this.loop();
        break;
      case "pause":
        break;
    }
  },

  changeFrameSet: function (frame_set, mode, delay = 5, frame_index = 0) {
    if (this.frame_set == frame_set) {
      return;
    }

    this.count = 0;
    this.delay = delay;
    this.frame_set = frame_set;
    this.frame_index = frame_index;
    this.frame_value = frame_set[frame_index];
    this.mode = mode;
  },

  loop: function () {
    this.count++;

    while (this.count > this.delay) {
      this.count -= this.delay;
      this.frame_index =
        this.frame_index < this.frame_set.length - 1 ? this.frame_index + 1 : 0;
      this.frame_value = this.frame_set[this.frame_index];
    }
  },
};

Game.Frame = function (x, y, width, height, offset_x = 0, offset_y = 0) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.offset_x = offset_x;
  this.offset_y = offset_y;
};
Game.Frame.prototype = {
  constructor: Game.Frame,
};

Game.TileSet = function () {
  let f = Game.Frame;

  this.frames = [
    new f(0, 0, 16, 16),
    new f(16, 0, 16, 16),
    new f(32, 0, 16, 16), // character 1 - down
    new f(0, 16, 16, 16),
    new f(16, 16, 16, 16),
    new f(32, 16, 16, 16),  // character 1 - left
    new f(0, 32, 16, 16),
    new f(16, 32, 16, 16),
    new f(32, 32, 16, 16),  // character 1 - right
    new f(0, 48, 16, 16),
    new f(16, 48, 16, 16),
    new f(32, 48, 16, 16),  // character 1 - up
  ];
};

Game.Player = function (x = 100, y = 20) {
  Game.Animator.call(this, Game.Player.prototype.frame_sets["idle-down"], 10);

  this.width = 16;
  this.height = 16;

  this.velocity_x = 0;
  this.velocity_y = 0;
  this.direction = "d"; // l, r, u, d
  this.speed = 3;

  this.x = x;
  this.y = y;
};

Game.Player.prototype = {
  constructor: Game.Player,

  frame_sets: {
    "idle-down": [0],
    "move-down": [0, 1, 2, 1],
    "idle-left": [3],
    "move-left": [3, 4, 5, 4],
    "idle-right": [6],
    "move-right": [6, 7, 8, 7],
    "idle-up": [9],
    "move-up": [9, 10, 11, 10],
  },

  moveLeft: function () {
    this.velocity_x = -this.speed;
    this.direction = "l";
  },

  moveRight: function () {
    this.velocity_x = this.speed;
    this.direction = "r";
  },

  moveUp: function () {
    this.velocity_y = -this.speed;
    this.direction = "u";
  },

  moveDown: function () {
    this.velocity_y = this.speed;
    this.direction = "d";
  },

  xUp: function () {
    this.velocity_x = 0;
  },

  yUp: function () {
    this.velocity_y = 0;
  },

  updateAnimation: function() {
    if (this.direction === "d") {  // 아래로 이동
      if (this.velocity_y === 0) {
        this.changeFrameSet(this.frame_sets["idle-down"], "pause")
      } else {
        this.changeFrameSet(this.frame_sets["move-down"], "loop")
      }
    } else if (this.direction === "l") {  // 왼쪽으로 이동
      if (this.velocity_x === 0) {
        this.changeFrameSet(this.frame_sets["idle-left"], "pause")
      } else {
        this.changeFrameSet(this.frame_sets["move-left"], "loop")
      }
    } else if (this.direction === "r") {  // 오른쪽으로 이동
      if (this.velocity_x === 0) {
        this.changeFrameSet(this.frame_sets["idle-right"], "pause")
      } else {
        this.changeFrameSet(this.frame_sets["move-right"], "loop")
      }
    } else if (this.direction === "u") {  // 오른쪽으로 이동
      if (this.velocity_y === 0) {
        this.changeFrameSet(this.frame_sets["idle-up"], "pause")
      } else {
        this.changeFrameSet(this.frame_sets["move-up"], "loop")
      }
    }

    this.animate();
  },

  update: function () {
    // x, y 좌표 이동
    this.x += this.velocity_x;
    this.y += this.velocity_y;
    this.updateAnimation();
  },
};
Object.assign(Game.Player.prototype, Game.Animator.prototype);

Game.World = function () {
  this.background_color = "#F0F8FF";

  this.tile_set = new Game.TileSet();
  this.player = new Game.Player();

  this.height = 200;
  this.width = 300;
};
Game.World.prototype = {
  collideObject: function (object) {
    if (object.x < 0) {
      object.x = 0;
      object.velocity_x = 0;
    } else if (object.x + object.width > this.width) {
      object.x = this.width - object.width;
      object.velocity_x = 0;
    }

    if (object.y < 0) {
      object.y = 0;
      object.velocity_y = 0;
    } else if (object.y + object.height > this.height) {
      object.y = this.height - object.height;
      object.velocity_y = 0;
    }
  },

  update: function () {
    // 가속도 개념 필요 없음, 같은 속도로 계속 이동
    this.player.update();
    this.collideObject(this.player);
  },
};
