"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Cat = /*#__PURE__*/function () {
  function Cat(name) {
    _classCallCheck(this, Cat);

    this.name = name;
  }

  _createClass(Cat, [{
    key: "meow",
    value: function meow() {
      return "Meow meow, I am ".concat(this.name);
    }
  }]);

  return Cat;
}();

module.exports = Cat;