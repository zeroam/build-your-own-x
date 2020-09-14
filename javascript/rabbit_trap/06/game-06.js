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

Game.Animator = function(frame_set, delay) {
    this.count = 0;
    this.delay = (delay >= 1) ? delay: 1;
    this.frame_set = frame_set;
    this.frame_index = 0;
    this.frame_value = frame_set[0];
    this.mode = "pause";
}

Game.Animator.prototype = {
    constructor: Game.Animator,

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

Game.Collider = function() {
    this.collide = function(value, object, tile_x, tile_y, tile_size) {
        switch(value) { // 타일타입 체크
            case 1: 
                this.collidePlatformTop(object, tile_y);
                break;
            case 2:
                this.collidePlatformRight(object, tile_x + tile_size);
                break;
            case 3:
                if (this.collidePlatformTop(object, tile_y)) return;
                this.collidePlatformRight(object, tile_x + tile_size);
                break;
            case 4:
                this.collidePlatformBottom(object, tile_y + tile_size);
                break;
            case 5:
                if (this.collidePlatformTop(object, tile_y)) return;
                this.collidePlatformBottom(object, tile_y + tile_size);
                break;
            case 6:
                if (this.collidePlatformRight(object, tile_x + tile_size)) return;
                this.collidePlatformBottom(object, tile_y + tile_size);
                break;
            case 7:
                if (this.collidePlatformTop(object, tile_y)) return;
                if (this.collidePlatformRight(object, tile_x + tile_size)) return;
                this.collidePlatformBottom(object, tile_y + tile_size);
                break;
            case 8:
                this.collidePlatformLeft(object, tile_x);
                break;
            case 9:
                if (this.collidePlatformTop(object, tile_y)) return;
                this.collidePlatformLeft(object, tile_x);
                break;
            case 10:
                if (this.collidePlatformRight(object, tile_x + tile_size)) return;
                this.collidePlatformLeft(object, tile_x);
                break;
            case 11:
                if (this.collidePlatformTop(object, tile_y)) return;
                if (this.collidePlatformRight(object, tile_x + tile_size)) return;
                this.collidePlatformLeft(object, tile_x);
                break;
            case 12:
                if (this.collidePlatformLeft(object, tile_x)) return;
                this.collidePlatformBottom(object, tile_y + tile_size);
                break;
            case 13:
                if (this.collidePlatformTop(object, tile_y)) return;
                if (this.collidePlatformLeft(object, tile_x)) return;
                this.collidePlatformBottom(object, tile_y + tile_size);
                break;
            case 14:
                if (this.collidePlatformTop(object, tile_y)) return;
                if (this.collidePlatformRight(object, tile_x + tile_size)) return;
                this.collidePlatformBottom(object, tile_y + tile_size);
                break;
            case 15:
                if (this.collidePlatformTop(object, tile_y)) return;
                if (this.collidePlatformLeft(object, tile_x)) return;
                if (this.collidePlatformRight(object, tile_x + tile_size)) return;
                this.collidePlatformBottom(object, tile_y + tile_size);
                break;
        }
    }
}

/* Here's where all of the collision functions live. */
Game.Collider.prototype = {
    constructor: Game.Collider,

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

Game.Frame = function(x, y, width, height, offset_x, offset_y) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.offset_x = offset_x;
    this.offset_y = offset_y;
};

Game.Frame.prototype = { constructor: Game.Frame };

Game.Object = function(x, y, width, height) {
    this.height = height;
    this.width = width;
    this.x = x;
    this.x_old = x;
    this.y = y;
    this.y_old = y;
};

/* Added getCenterX, getCenterY, setCenterX, setCenterY */
Game.Object.prototype = {
    constructor: Game.Object,

    getBottom: function() { return this.y + this.height; },
    getCenterX: function() { return this.x + this.width * 0.5; },
    getCenterY: function() { return this.y + this.height * 0.5; },
    getLeft: function() { return this.x; },
    getRight: function() { return this.x + this.width; },
    getTop: function() { return this.y; },
    setCenterX: function(x) { this.x = x - this.width * 0.5; },
    setCenterY: function(y) { this.y = y - this.width * 0.5; },
    setBotton: function(y) { this.y = y - this.height; },
    setLeft: function(x) { this.x = x; },
    setRight: function(x) { this.x = x - this.width; },
    setTop: function(y) { this.y = y; },
};

Game.MovingObject = function(x, y, width, height, velocity_max=15) {
    Game.Object.call(this, x, y, width, height);

    this.jumping = false;
    this.velocity_max = velocity_max;  // added velocity_max so velocity can't go past 16
    this.velocity_x = 0;
    this.velocity_y = 0;
    this.x_old = x;
    this.y_old = y;
}

Game.MovingObject.prototype = {
    constructor: Game.MovingObject,

    getOldBottom: function() { return this.y_old + this.height; },
    getOldCenterX: function() { return this.x_old + this.width * 0.5; },
    getOldCenterY: function() { return this.y_old + this.height * 0.5; },
    getOldLeft: function() { return this.x_old; },
    getOldRight: function() { return this.x_old + this.width; },
    getOldTop: function() { return this.y_old},
    setOldBottom: function(y) { this.y_old = y - this.height; },
    setOldCenterX: function(x) { this.x_old = x - this.width * 0.5; },
    setOldCenterY: function(y) { this.y_old = y - this.height * 0.5},
    setOldLeft: function(x) { this.x_old = x; },
    setOldRight: function(x) { this.x_old = x - this.width; },
    setOldTop: function(y) { this.y_old = y; }
};
Object.assign(Game.MovingObject.prototype, Game.Object.prototype);
Game.MovingObject.prototype.constructor = Game.MovingObject;

Game.Door = function(door) {
    Game.Object.call(this, door.x, door.y, door.width, door.height);

    this.destination_x = door.destination_x;
    this.destination_y = door.destination_y;
    this.destination_zone = door.destination_zone;
};

Game.Door.prototype = {
    collideObject(object) {
        let center_x = object.getCenterX();
        let center_y = object.getCenterY();

        if (center_x < this.getLeft() || center_x > this.getRight() ||
            center_y < this.getTop() || center_y > this.getBottom()) return false;

        return true;
    }
};
Object.assign(Game.Door.prototype, Game.Object.prototype);
Game.Door.prototype.constructor = Game.Door;

Game.Player = function(x, y) {
    Game.MovingObject.call(this, x, y, 7, 14);
    Game.Animator.call(this, Game.Player.prototype.frame_sets["idle-left"], 10);

    this.jumping = true;
    this.direction_x = -1;
    this.velocity_x = 0;
    this.velocity_y = 0;
};

Game.Player.prototype = {
    constructor: Game.Player,

    frame_sets: {
        "idle-left": [0],
        "jump-left": [1],
        "move-left": [2, 3, 4, 5],
        "idle-right": [6],
        "jump-right": [7],
        "move-right": [8, 9, 10, 11]
    },

    jump: function() {
        /* Made it so you can only jump if you aren't falling faster than 10px per frame */
        if (!this.jumping && this.velocity_y < 10) {
            this.jumping = true;
            this.velocity_y -= 14;
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
Object.assign(Game.Player.prototype, Game.MovingObject.prototype);
Object.assign(Game.Player.prototype, Game.Animator.prototype);
Game.Player.prototype.constructor = Game.Player;

Game.TileSet = function(columns, tile_size) {
    this.columns = columns;
    this.tile_size = tile_size;

    let f = Game.Frame;

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

Game.TileSet.prototype = { constructor: Game.TileSet };

Game.World = function(friction=0.85, gravity=2) {
    this.collider = new Game.Collider();

    this.friction = friction;
    this.gravity = gravity;

    this.columns = 12;
    this.rows = 9;

    this.tile_set = new Game.TileSet(8, 16);
    this.player = new Game.Player(32, 76);

    this.zone_id = "00"; // The current zone

    this.doors = [];  // The array of doors in the level
    this.door = undefined; // If the player enters a door, the game will set this property to that door and the level will be loaded

    this.height = this.tile_set.tile_size * this.rows;
    this.width = this.tile_set.tile_size * this.columns;

};

Game.World.prototype = {

    constructor: Game.World,

    collideObject: function(object) {
        // tile과 충돌 체크
        var bottom, left, right, top, value;

        // top, left corner check
        top = Math.floor(object.getTop() / this.tile_set.tile_size);
        left = Math.floor(object.getLeft() / this.tile_set.tile_size);
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

    setup: function(zone) {
        /* Get the new tile maps, the new zone, and reset the doors array. */
        this.graphical_map = zone.graphical_map;
        this.collision_map = zone.collision_map;
        this.columns = zone.columns;
        this.rows = zone.rows;
        this.doors = new Array();
        this.zone_id = zone.id;

        /* Generate new doors. */
        for (let index = zone.doors.length - 1; index > -1; --index) {
            let door = zone.doors[index];
            this.doors[index] = new Game.Door(door);
        }

        /* If the player entered into a door, this.door will reference that door. Here
        it will be used to set the player's location to the door's destination */
        if (this.door) {
            /* if a destination is equal to -1, that means it won't be used. Since each zone
            spans from 0 to its width and height, any negative number would be invalid. If
            a door's destination is -1, the player will keep his current position for that axis. */
            if (this.door.destination_x != -1) {
                this.player.setCenterX(this.door.destination_x);
                this.player.setOldCenterX(this.door.destination_x);
            }
            if (this.door.destination_y != -1) {
                this.player.setCenterY(this.door.destination_y);
                this.player.setOldCenterY(this.door.destination_y);
            }

            this.door = undefined;  // Make sure to reset this.door so we don't trigger a zone load.
        }
    },

    update: function() {
        this.player.updatePosition(this.gravity, this.friction);

        // 벽과 충돌하는 지 확인
        this.collideObject(this.player);

        for (let index = this.doors.length - 1; index > -1; --index) {
            let door = this.doors[index];

            if (door.collideObject(this.player)) {
                this.door = door;
            };
        }

        this.player.updateAnimation();
    }

};
