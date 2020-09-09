const Game = function() {
    /* The world object is not its own class. */
    this.world = new Game.World();

    /* The Game.update function works the same as in part 2. */
    this.update = function() {
        this.world.update();
    };
};

Game.prototype = {
    constructor: Game
};

Game.World = function(friction=0.8, gravity=2) {
    this.collider = new Game.World.Collider();

    this.friction = friction;
    this.gravity = gravity;

    this.player = new Game.World.Object.Player();

    this.columns = 12;
    this.rows = 9;

    this.tile_set = new Game.World.TileSet(8, 16);
    this.player = new Game.World.Object.Player(100, 100);

    this.map = [
        48,17,17,17,49,48,18,19,16,17,35,36,
        10,39,39,39,16,18,39,31,31,31,39,07,
        10,31,39,31,31,31,39,12,05,05,28,01,
        35,06,39,39,31,39,39,19,39,39,08,09,
        02,31,31,47,39,47,39,31,31,04,36,25,
        10,39,39,31,39,39,39,31,31,31,39,37,
        10,39,31,04,14,06,39,39,03,39,00,42,
        49,02,31,31,11,39,39,31,11,00,42,09,
        08,40,27,13,37,27,13,03,22,34,09,24
    ];

    /* collision_map
    이진수 값이 각각의 벽을 의미

    0000 = 0  tile 0:    0    tile 1:   1     tile 2:    0    tile 15:    1
    0001 = 1           0   0          0   0            0   1            1   1
    0010 = 2             0              0                0                1
    1111 = 15        No walls     Wall on top      Wall on Right      four walls

    0 0 0 0 = l b r t (left bottom right top)
    */
    this.collision_map = [
        00,04,04,04,00,00,04,04,04,04,04,00,
        02,00,00,00,12,06,00,00,00,00,00,08,
        02,00,00,00,00,00,00,09,05,05,01,00,
        00,07,00,00,00,00,00,14,00,00,08,00,
        02,00,00,01,00,01,00,00,00,13,04,00,
        02,00,00,00,00,00,00,00,00,00,00,08,
        02,00,00,13,01,07,00,00,11,00,09,00,
        00,03,00,00,10,00,00,00,08,01,00,00,
        00,00,01,01,00,01,01,01,00,00,00,00
    ];

    this.height = this.tile_set.tile_size * this.rows;
    this.width = this.tile_set.tile_size * this.columns;

};

/* Now that world is a class, I moved its more generic functions into tis prototype. */
Game.World.prototype = {

    constructor: Game.World,

    // Game World 경계선 체크
    collideObject: function(object) {
        if (object.x < 0) { object.x = 0; object.velocity_x = 0; }
        else if (object.x + object.width > this.width) { object.x = this.width - object.width; object.velocity_x = 0; }
        if (object.y < 0) { object.y = 0; object.velocity_y = 0; }
        else if (object.y + object.height > this.height) { object.jumping = false; object.y = this.height - object.height; object.velocity_y = 0; }

        // tile과 충돌 체크
        var bottom, left, right, top, value;

        // top, left corner check
        top = Math.floor(object.getTop() / this.tile_set.tile_size);
        left = Math.floor(object.getLeft() / this.tile_set.tile_size);
        // 플레이어의 위치에 속하는 collision_map의 타입
        value = this.collision_map[top * this.columns + left];
        this.collider.collide(value, object, left * this.tile_set.tile_size, top * this.tile_set.tile_size, this.tile_set.tile_size);

        // top, right corner check
        top = Math.floor(object.getTop() / this.tile_set.tile_size);
        right = Math.floor(object.getRight() / this.tile_set.tile_size);
        value = this.collision_map[top * this.columns + right];
        this.collider.collide(value, object, right * this.tile_set.tile_size, top * this.tile_set.tile_size, this.tile_set.tile_size);

        // bottom, left corner check
        bottom = Math.floor(object.getBottom() / this.tile_set.tile_size);
        left = Math.floor(object.getLeft() / this.tile_set.tile_size);
        value = this.collision_map[bottom * this.columns + left];
        this.collider.collide(value, object, left * this.tile_set.tile_size, bottom * this.tile_set.tile_size, this.tile_set.tile_size);

        // bottom, right corner check
        bottom = Math.floor(object.getBottom() / this.tile_set.tile_size);
        right = Math.floor(object.getRight() / this.tile_set.tile_size);
        value = this.collision_map[bottom * this.columns + right];
        this.collider.collide(value, object, right * this.tile_set.tile_size, bottom * this.tile_set.tile_size, this.tile_set.tile_size);
    },


    update: function() {
        this.player.updatePosition(this.gravity, this.friction);

        // 벽과 충돌하는 지 확인
        this.collideObject(this.player);

        this.player.updateAnimation();
    }

};

Game.World.Collider = function() {
    this.collide = function(value, object, tile_x, tile_y, tile_size) {
        switch(value) { // 타일타입 체크
            case 1: 
                /*  1
                  0 P 0
                    0   */
                this.collidePlatformTop(object, tile_y);
                break;
            case 2:
                /*  0
                  0 P 1
                    0   */
                this.collidePlatformRight(object, tile_x + tile_size);
                break;
            case 3:
                /*  1
                  0 P 1
                    0   */
                if (this.collidePlatformTop(object, tile_y)) return;
                this.collidePlatformRight(object, tile_x + tile_size);
                break;
            case 4:
                /*  0
                  0 P 0
                    1   */
                this.collidePlatformBottom(object, tile_y + tile_size);
                break;
            case 5:
                /*  1
                  0 P 0
                    1   */
                if (this.collidePlatformTop(object, tile_y)) return;
                this.collidePlatformBottom(object, tile_y + tile_size);
                break;
            case 6:
                /*  0
                  0 P 1
                    1   */
                if (this.collidePlatformRight(object, tile_x + tile_size)) return;
                this.collidePlatformBottom(object, tile_y + tile_size);
                break;
            case 7:
                /*  1
                  0 P 1
                    1   */
                if (this.collidePlatformTop(object, tile_y)) return;
                if (this.collidePlatformRight(object, tile_x + tile_size)) return;
                this.collidePlatformBottom(object, tile_y + tile_size);
                break;
            case 8:
                /*  0
                  1 P 0
                    0   */
                this.collidePlatformLeft(object, tile_x);
                break;
            case 9:
                /*  1
                  1 P 0
                    0   */
                if (this.collidePlatformTop(object, tile_y)) return;
                this.collidePlatformLeft(object, tile_x);
                break;
            case 10:
                /*  0
                  1 P 1
                    0   */
                if (this.collidePlatformRight(object, tile_x + tile_size)) return;
                this.collidePlatformLeft(object, tile_x);
                break;
            case 11:
                /*  1
                  1 P 1
                    0   */
                if (this.collidePlatformTop(object, tile_y)) return;
                if (this.collidePlatformRight(object, tile_x + tile_size)) return;
                this.collidePlatformLeft(object, tile_x);
                break;
            case 12:
                /*  0
                  1 P 0
                    1   */
                if (this.collidePlatformLeft(object, tile_x)) return;
                this.collidePlatformBottom(object, tile_y + tile_size);
                break;
            case 13:
                /*  1
                  1 P 0
                    1   */
                if (this.collidePlatformTop(object, tile_y)) return;
                if (this.collidePlatformLeft(object, tile_x)) return;
                this.collidePlatformBottom(object, tile_y + tile_size);
                break;
            case 14:
                /*  0
                  1 P 1
                    1   */
                if (this.collidePlatformTop(object, tile_y)) return;
                if (this.collidePlatformRight(object, tile_x + tile_size)) return;
                this.collidePlatformBottom(object, tile_y + tile_size);
                break;
            case 15:
                /*  1
                  1 P 1
                    1   */
                if (this.collidePlatformTop(object, tile_y)) return;
                if (this.collidePlatformLeft(object, tile_x)) return;
                if (this.collidePlatformRight(object, tile_x + tile_size)) return;
                this.collidePlatformBottom(object, tile_y + tile_size);
                break;
        }
    }
}

/* Here's where all of the collision functions live. */
Game.World.Collider.prototype = {
    constructor: Game.World.Collider,

    collidePlatformBottom: function(object, tile_bottom) {
        /* object의 top이 타일의 bottom 보다 위에 있고
        이전 프레임의 object의 top이 타일의 bottom 보다 밑에 있을 경우 */
        if (object.getTop() < tile_bottom && object.getOldTop() >= tile_bottom) {
            object.setTop(tile_bottom);  // tile의 bottom 좌표를 기준으로 object의 top 위치 설정
            object.velocity_y = 0;
            return true;
        }
        return false;
    },

    collidePlatformLeft: function(object, tile_left) {
        if (object.getRight() > tile_left && object.getOldRight() <= tile_left) {
            object.setRight(tile_left - 0.01)  // rounding으로 인해 발생하는 에러 해결을 위해 0.01을 빼줌
            object.velocity_x = 0;
            return true;
        }
        return false;
    },

    collidePlatformRight: function(object, tile_right) {
        if (object.getLeft() < tile_right && object.getOldLeft() >= tile_right) {
            object.setLeft(tile_right);
            object.velocity_x = 0;
            return true;
        }
        return false;
    },

    collidePlatformTop: function(object, tile_top) {
        if (object.getBottom() > tile_top && object.getOldBottom() <= tile_top) {
            object.setBotton(tile_top - 0.01);
            object.velocity_y = 0;
            object.jumping = false;
            return true;
        }
        return false;
    }
}

/* The object class is just a basic rectangle with a bunch of prototype functions
to help us work with positioning this rectangle */
Game.World.Object = function(x, y, width, height) {
    this.height = height;
    this.width = width;
    this.x = x;
    this.x_old = x;
    this.y = y;
    this.y_old = y;
};

Game.World.Object.prototype = {
    constructor: Game.World.Object,

    /* These functions are used to get and set the different side positions of the object */
    getBottom: function() { return this.y + this.height; },
    getLeft: function() { return this.x; },
    getRight: function() { return this.x + this.width; },
    getTop: function() { return this.y; },
    getOldBottom: function() { return this.y_old + this.height; },
    getOldLeft: function() { return this.x_old; },
    getOldRight: function() { return this.x_old + this.width; },
    getOldTop: function() { return this.y_old},
    setBotton: function(y) { this.y = y - this.height; },
    setLeft: function(x) { this.x = x; },
    setRight: function(x) { this.x = x - this.width; },
    setTop: function(y) { this.y = y; },
    setOldBottom: function(y) { this.y_old = y - this.height; },
    setOldLeft: function(x) { this.x_old = x; },
    setOldRight: function(x) { this.x_old = x - this.width; },
    setOldTop: function(y) { this.y_old = y; }
};

Game.World.Object.Animator = function(frame_set, delay) {
    this.count = 0;
    this.delay = (delay >= 1) ? delay: 1;
    this.frame_set = frame_set;
    this.frame_index = 0;
    this.frame_value = frame_set[0];
    this.mode = "pause";
}

Game.World.Object.Animator.prototype = {
    constructor: Game.World.Object.Animator,

    animate: function() {
        switch(this.mode) {
            case "loop": this.loop(); break;
            case "pause": break;
        }
    },

    changeFrameSet(frame_set, mode, delay=10, frame_index=0) {
        if (this.frame_set === frame_set) {
            return;
        }

        this.count = 0;
        this.delay = delay;
        this.frame_set = frame_set;
        this.frame_index = frame_index;
        this.frame_value = frame_set[frame_index];
        this.mode = mode;
    },

    loop: function() {
        this.count++;

        while(this.count > this.delay) {
            this.count -= this.delay;
            this.frame_index = (this.frame_index < this.frame_set.length - 1) ? this.frame_index + 1 : 0;
            this.frame_value = this.frame_set[this.frame_index];
        }
    }
};

Game.World.Object.Player = function(x, y) {
    // 부모 인스턴스 변수 및 메서드 this에 대입
    Game.World.Object.call(this, 100, 100, 7, 14);
    Game.World.Object.Animator.call(this, Game.World.Object.Player.prototype.frame_sets["idle-left"], 10);

    this.jumping = true;
    this.direction_x = -1;
    this.velocity_x = 0;
    this.velocity_y = 0;
};

Game.World.Object.Player.prototype = {
    constructor: Game.World.Object.Player,

    frame_sets: {
        "idle-left": [0],
        "jump-left": [1],
        "move-left": [2, 3, 4, 5],
        "idle-right": [6],
        "jump-right": [7],
        "move-right": [8, 9, 10, 11]
    },

    jump: function() {
        if (!this.jumping) {
            this.jumping = true;
            this.velocity_y -= 13;
        }
    },

    moveLeft: function() {
        this.direction_x = -1;
        this.velocity_x -= 0.55;
    },
    moveRight: function() {
        this.direction_x = 1;
        this.velocity_x += 0.55;
    },

    updateAnimation: function() {
        if (this.velocity_y < 0) {
            if (this.direction_x < 0) {
                this.changeFrameSet(this.frame_sets["jump-left"], "pause");
            } else {
                this.changeFrameSet(this.frame_sets["jump-right"], "pause")
            }
        } else if (this.direction_x < 0) {
            if (this.velocity_x < -0.1) {
                this.changeFrameSet(this.frame_sets["move-left"], "loop", 5)
            } else {
                this.changeFrameSet(this.frame_sets["idle-left"], "pause")
            }
        } else if (this.direction_x > 0) {
            if (this.velocity_x > 0.1) {
                this.changeFrameSet(this.frame_sets["move-right"], "loop", 5)
            } else {
                this.changeFrameSet(this.frame_sets["idle-right"], "pause")
            }
        }

        this.animate();
    },

    updatePosition: function(gravity, friction) {
        this.x_old = this.x;
        this.y_old = this.y;

        this.velocity_y += gravity;
        this.velocity_x *= friction;

        // tunneling 방지
        if (Math.abs(this.velocity_x) > this.velocity_max) {
            this.velocity_x = this.velocity_max * Math.sign(this.velocity_x)
        }
        if (Math.abs(this.velocity_y) > this.velocity_max) {
            this.velocity_y = this.velocity_max * Math.sign(this.velocity_y)
        }

        this.x += this.velocity_x;
        this.y += this.velocity_y;
    },
};

// Object의 prototype을 Player의 prototype에 대입
Object.assign(Game.World.Object.Player.prototype, Game.World.Object.prototype);
Object.assign(Game.World.Object.Player.prototype, Game.World.Object.Animator.prototype);
Game.World.Object.Player.prototype.constructor = Game.World.Object.Player;


Game.World.TileSet = function(columns, tile_size) {
    this.columns = columns;
    this.tile_size = tile_size;

    let f = Game.World.TileSet.Frame;

    /* An array of all the frames in the tile sheet image. */
    this.frames = [
        new f(115,  96, 13, 16, 0, -2), // idle-left
        new f( 50,  96, 13, 16, 0, -2), // jump-left
        new f(102,  96, 13, 16, 0, -2), new f(89, 96, 13, 16, 0, -2), new f(76, 96, 13, 16, 0, -2), new f(63, 96, 13, 16, 0, -2), // walk-left
        new f(  0, 112, 13, 16, 0, -2), // idle-right
        new f( 65, 112, 13, 16, 0, -2), // jump-right
        new f( 13, 112, 13, 16, 0, -2), new f(26, 112, 13, 16, 0, -2), new f(39, 112, 13, 16, 0, -2), new f(52, 112, 13, 16, 0, -2) // walk-right
    ];
};

Game.World.TileSet.prototype = {
    constructor: Game.World.TileSet
};

Game.World.TileSet.Frame = function(x, y, width, height, offset_x, offset_y) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.offset_x = offset_x;
    this.offset_y = offset_y;
};

Game.World.TileSet.Frame.prototype = {
    constructor: Game.World.TileSet.Frame
};