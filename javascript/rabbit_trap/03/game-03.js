const Game = function() {
    /* The world object is not its own class. */
    this.world = new Game.World();

    /* The Game.update function works the same as in part 2. */
    this.update = function() {
        this.world.update();
    };
};

Game.prototype = { constructor: Game };

Game.World = function(friction=0.9, gravity=3) {
    this.friction = friction;
    this.gravity = gravity;

    /* Player is now its own class inside of the Game.World object */
    this.player = new Game.World.Player();

    /* Here is the map data. Later on I will load it from a json file, but for now
    I will just hardcode it here. */
    this.columns = 12;
    this.rows = 9;
    this.tile_size = 16;
    this.map = [49,18,18,18,50,49,19,20,17,18,36,37,
                11,40,40,40,17,19,40,32,32,32,40,08,
                11,32,40,32,32,32,40,13,06,06,29,02,
                36,07,40,40,32,40,40,20,40,40,09,10,
                03,32,32,48,40,48,40,32,32,05,37,26,
                11,40,40,32,40,40,40,32,32,32,40,38,
                11,40,32,05,15,07,40,40,04,40,01,43,
                50,03,32,32,12,40,40,32,12,01,43,10,
                09,41,28,14,38,28,14,04,23,35,10,25];

    /* Height and Width now depend on the map size */
    this.height = this.tile_size * this.rows;
    this.width = this.tile_size * this.columns;

};

/* Now that world is a class, I moved its more generic functions into tis prototype. */
Game.World.prototype = {

    constructor: Game.World,

    collideObject: function(object) { // same as part2
        if (object.x < 0) { object.x = 0; object.velocity_x = 0; }
        else if (object.x + object.width > this.width) { object.x = this.width - object.width; object.velocity_x = 0; }
        if (object.y < 0) { object.y = 0; object.velocity_y = 0; }
        else if (object.y + object.height > this.height) { object.jumping = false; object.y = this.height - object.height; object.velocity_y = 0; }
    },

    update: function() {
        // 현재 속도에 맞게 player 좌표 변경
        this.player.velocity_y += this.gravity;
        this.player.update();

        // 속도 변경
        this.player.velocity_x *= this.friction;
        this.player.velocity_y *= this.friction;

        // 벽과 충돌하는 지 확인
        this.collideObject(this.player);
    }

};

Game.World.Player = function(x, y) {
    this.color1 = "#404040";
    this.color2 = "#f0f0f0";
    this.height = 12;
    this.jumping = true;
    this.velocity_x = 0;
    this.velocity_y = 0;
    this.width = 12;
    this.x = 100;
    this.y = 50;
}

Game.World.Player.prototype = {
    constructor: Game.World.Player,

    jump: function() {
        if (!this.jumping) {
            this.jumping = true;
            this.velocity_y -= 20;
        }
    },

    moveLeft: function() {
        this.velocity_x -= 0.5;
    },
    moveRight: function() {
        this.velocity_x += 0.5;
    },

    update: function() {
        this.x += this.velocity_x;
        this.y += this.velocity_y;
    }

};