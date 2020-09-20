const Engine = function (time_step, update, render) {
  this.accumulated_time = 0; // Amount of time that's accumulated since the last update
  this.animation_frame_request = undefined; // reference to the AFR
  this.time = undefined; // The most recent timestamp of loop execution
  this.time_step = time_step; // 1000/30 = 30 frames per second

  this.updated = false; // Whether or not the update function has been called since the last cycle

  this.update = update; // The update function
  this.render = render; // The render function

  this.run = function (time_stamp) {
    // This is one cycle of the game loop
    this.animation_frame_request = window.requestAnimationFrame(this.handleRun);

    this.accumulated_time += time_stamp - this.time;
    this.time = time_stamp;

    if (this.accumulated_time >= this.time_step * 3) {
      this.accumulated_time = this.time_step;
    }

    while (this.accumulated_time >= this.time_step) {
      this.accumulated_time -= this.time_step;
      this.update(time_stamp);
      this.updated = true; // If the game has updated, we need to draw it again
    }

    /* This allows us to only draw when the game has updated. */
    if (this.updated) {
      this.updated = false;
      this.render(time_stamp);
    }
  };

  this.handleRun = (time_step) => {
    this.run(time_step);
  };
};

Engine.prototype = {
  constructor: Engine,

  start: function () {
    this.accumulated_time = this.time_step;
    this.time = window.performance.now();
    this.animation_frame_request = window.requestAnimationFrame(this.handleRun);
  },

  stop: function () {
    window.cancelAnimationFrame(this.animation_frame_request);
  },
};
