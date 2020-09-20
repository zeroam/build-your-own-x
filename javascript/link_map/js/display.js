const Display = function (canvas) {
  this.buffer = document.createElement("canvas").getContext("2d");
  this.context = canvas.getContext("2d");

  this.drawBaseMap = function (image, image_col, map_list, value, tile_size) {
    let rows = map_list.length;
    let columns = map_list[0].length;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        let src_x = (value % image_col) * tile_size;
        let src_y = Math.floor(value / image_col) * tile_size;

        let dest_x = j * tile_size;
        let dest_y = i * tile_size;

        this.buffer.drawImage(
          image,
          src_x,
          src_y,
          tile_size,
          tile_size,
          dest_x,
          dest_y,
          tile_size,
          tile_size
        );
      }
    }
  };

  this.drawMap = function (image, image_col, map_list, tile_size) {
    let rows = map_list.length;
    let columns = map_list[0].length;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        let value = map_list[i][j];

        if (value == -1) {
          continue;
        }

        let src_x = (value % image_col) * tile_size;
        let src_y = Math.floor(value / image_col) * tile_size;

        let dest_x = j * tile_size;
        let dest_y = i * tile_size;

        this.buffer.drawImage(
          image,
          src_x,
          src_y,
          tile_size,
          tile_size,
          dest_x,
          dest_y,
          tile_size,
          tile_size
        );
      }
    }
  };

  this.drawTileObject = function (
    image,
    image_col,
    value,
    dest_row,
    dest_col,
    tile_size
  ) {
    let src_x = (value % image_col) * tile_size;
    let src_y = Math.floor(value / image_col) * tile_size;

    let dest_x = dest_col * tile_size;
    let dest_y = dest_row * tile_size;

    this.buffer.drawImage(
      image,
      src_x,
      src_y,
      tile_size,
      tile_size,
      dest_x,
      dest_y,
      tile_size,
      tile_size
    );
  };

  this.drawObject = function (
    image,
    src_x,
    src_y,
    src_width,
    src_height,
    dest_x,
    dest_y,
    dest_width,
    dest_height
  ) {
    this.buffer.drawImage(
      image,
      src_x,
      src_y,
      src_width,
      src_height,
      Math.round(dest_x),
      Math.round(dest_y),
      dest_width,
      dest_height
    );
  };

  this.fill = function (color) {
    this.buffer.fillStyle = color;
    this.buffer.fillRect(
      0,
      0,
      this.buffer.canvas.width,
      this.buffer.canvas.height
    );
  };

  this.render = function () {
    this.context.drawImage(
      this.buffer.canvas,
      0,
      0,
      this.buffer.canvas.width,
      this.buffer.canvas.height,
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height
    );
  };

  this.resize = function (width, height, height_width_ratio) {
    if (height / width > height_width_ratio) {
      this.context.canvas.height = width * height_width_ratio;
      this.context.canvas.width = width;
    } else {
      this.context.canvas.height = height;
      this.context.canvas.width = height / height_width_ratio;
    }

    this.context.imageSmoothingEnabled = false;
  };
};

Display.prototype = {
  constructor: Display,
};
