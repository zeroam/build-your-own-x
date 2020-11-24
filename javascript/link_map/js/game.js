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

Game.Collider = function () {
  // 충돌인지 아닌지만 판별하면 됨
  this.collide = function (value, object, tile_x, tile_y, tile_size) {
    if (value === 1) {
      // collideBottom
      if (object.getTop() < tile_y) {
        object.setTop(tile_y);
        object.velocity_y = 0;
      }

      // collideLeft
      if (object.getRight() > tile_x) {
        object.setRight(tile_x);
        object.velocity_x = 0;
      }

      // collideRight
      if (object.getLeft() < tile_x) {
        object.setLeft(tile_x);
        object.velocity_x = 0;
      }

      // collideTop
      if (object.getBottom() > tile_y) {
        object.setBottom(tile_y);
        object.velocity_y = 0;
      }

    }
  }
}

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

Game.Object = function (x, y, width, height) {
  this.x = x;
  this.x_old = x;
  this.y = y;
  this.y_old = y;
  this.width = width;
  this.height = height;
};
Game.Object.prototype = {
  constructor: Game.Object,

  collideObject: function (object) {
    if (
      this.getRight() < object.getLeft() ||
      this.getBottom() < object.getTop() ||
      this.getLeft() > object.getRight() ||
      this.getTop() > object.getBottom()
    ) {
      return false;
    }

    return true;
  },

  getBottom: function () {
    return this.y + this.height;
  },

  getLeft: function () {
    return this.x;
  },

  getRight: function () {
    return this.x + this.width;
  },

  getTop: function () {
    return this.y;
  },

  setBottom: function (y) {
    this.y = this.y - this.height;
  },

  setLeft: function (x) {
    this.x = x;
  },

  setRight: function (x) {
    this.x = x + this.width;
  },

  setTop: function (y) {
    this.y = y;
  }
};

Game.TileSet = function (rows, columns, tile_size) {
  let f = Game.Frame;

  this.tile_size = tile_size;

  this.frames = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      this.frames.push(
        new f(tile_size * col, tile_size * row, tile_size, tile_size)
      );
    }
  }
};

Game.Player = function (x = 100, y = 20) {
  Game.Object.call(this, x, y, 16, 16);
  Game.Animator.call(this, Game.Player.prototype.frame_sets["idle-down"], 10);

  this.velocity_x = 0;
  this.velocity_y = 0;
  this.direction = "d"; // l, r, u, d
  this.speed = 3;
};

Game.Player.prototype = {
  constructor: Game.Player,

  frame_sets: {
    "idle-down": [0],
    "move-down": [0, 1, 2, 1],
    "idle-left": [12],
    "move-left": [12, 13, 14, 13],
    "idle-right": [24],
    "move-right": [24, 25, 26, 25],
    "idle-up": [36],
    "move-up": [36, 37, 38, 37],
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

  updateAnimation: function () {
    if (this.direction === "d") {
      // 아래로 이동
      if (this.velocity_y === 0) {
        this.changeFrameSet(this.frame_sets["idle-down"], "pause");
      } else {
        this.changeFrameSet(this.frame_sets["move-down"], "loop");
      }
    } else if (this.direction === "l") {
      // 왼쪽으로 이동
      if (this.velocity_x === 0) {
        this.changeFrameSet(this.frame_sets["idle-left"], "pause");
      } else {
        this.changeFrameSet(this.frame_sets["move-left"], "loop");
      }
    } else if (this.direction === "r") {
      // 오른쪽으로 이동
      if (this.velocity_x === 0) {
        this.changeFrameSet(this.frame_sets["idle-right"], "pause");
      } else {
        this.changeFrameSet(this.frame_sets["move-right"], "loop");
      }
    } else if (this.direction === "u") {
      // 오른쪽으로 이동
      if (this.velocity_y === 0) {
        this.changeFrameSet(this.frame_sets["idle-up"], "pause");
      } else {
        this.changeFrameSet(this.frame_sets["move-up"], "loop");
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
Object.assign(Game.Player.prototype, Game.Object.prototype);
Object.assign(Game.Player.prototype, Game.Animator.prototype);
Game.Player.prototype.constructor = Game.Player;

// 충돌 시 링크가 세팅되는 오브젝트
Game.LinkObject = function (rows, cols, url, tile_size = 16) {
  // row, col 기반으로 object 생성
  Game.Object.call(this, cols * 16, rows * 16, 16, 16);
  Game.Animator.call(
    this,
    Game.LinkObject.prototype.frame_sets["idle-treasure"],
    10
  );
  // step 1. 일단 충돌 시 해당 링크가 콘솔창에 출력 되도록 설정
  this.url = url;
  this.is_near = false;
};
Game.LinkObject.prototype = {
  frame_sets: {
    "idle-treasure": [36],
    "move-treasure": [35, 36],
  },

  open: function () {
    // window.open(this.url, "_blank")
    if (this.is_near === true) {
      location.href = this.url;
    }
  },

  update: function (player) {
    if (this.collideObject(player)) {
      if (this.is_near === false) {
        this.changeFrameSet(this.frame_sets["move-treasure"], "loop", 15);
        this.is_near = true;
      }
    } else {
      this.changeFrameSet(this.frame_sets["idle-treasure"], "pause");
      this.is_near = false;
    }

    this.animate();
  },
};
Object.assign(Game.LinkObject.prototype, Game.Object.prototype);
Object.assign(Game.LinkObject.prototype, Game.Animator.prototype);
Game.LinkObject.prototype.constructor = Game.LinkObject;

Game.World = function () {
  this.background_color = "#F0F8FF";

  this.collider = new Game.Collider();

  this.character_set = new Game.TileSet(8, 12, 16);
  this.tile_set = new Game.TileSet(11, 8, 16);
  this.player = new Game.Player(100, 100);

  // 나중에는 동적으로 추가되는 오브젝트
  this.link_obj = new Game.LinkObject(3, 2, "https://github.com");

  this.columns = 18;
  this.rows = 12;
  this.width = this.columns * 16;
  this.height = this.rows * 16;

  // -1값은 기본 베이스 이미지 사용
  this.map = [
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 12, 12, 12],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 12, 31, 12],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 12, 12, 12],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, 58, 67, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  ];

  this.collision_map = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]
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

    // tile과 충돌 체크
    var bottom, left, right, top, value;

    // top, left corner check
    top = Math.floor(object.getTop() / this.tile_set.tile_size);
    left = Math.floor(object.getLeft() / this.tile_set.tile_size);
    value = this.collision_map[top][left];
    this.collider.collide(
      value,
      object,
      left * this.tile_set.tile_size,
      top * this.tile_set.tile_size,
      this.tile_set.tile_size
    );

    // top, right corner check
    top = Math.floor(object.getTop() / this.tile_set.tile_size);
    right = Math.floor(object.getRight() / this.tile_set.tile_size);
    value = this.collision_map[top][right];
    this.collider.collide(
      value,
      object,
      right * this.tile_set.tile_size,
      top * this.tile_set.tile_size,
      this.tile_set.tile_size
    );

    // bottom, left corner check
    bottom = Math.floor(object.getBottom() / this.tile_set.tile_size);
    left = Math.floor(object.getLeft() / this.tile_set.tile_size);
    value = this.collision_map[bottom][left];
    this.collider.collide(
      value,
      object,
      left * this.tile_set.tile_size,
      bottom * this.tile_set.tile_size,
      this.tile_set.tile_size
    );

    // bottom, right corner check
    bottom = Math.floor(object.getBottom() / this.tile_set.tile_size);
    right = Math.floor(object.getRight() / this.tile_set.tile_size);
    value = this.collision_map[bottom][right];
    this.collider.collide(
      value,
      object,
      right * this.tile_set.tile_size,
      bottom * this.tile_set.tile_size,
      this.tile_set.tile_size
    );
  },

  update: function () {
    // 가속도 개념 필요 없음, 같은 속도로 계속 이동
    this.player.update();

    this.collideObject(this.player);

    // player 위치에 기반에 상태 변경
    this.link_obj.update(this.player);
  },
};
