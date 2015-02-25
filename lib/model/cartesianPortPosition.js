/**
 * Defines a position of a Port using x, y from upper left
 * 
 * @class CardinalPortPosition
 * @param {CardinalDirection} direction
 * @param {Number} (unitless)
 */
var CartesianPortPosition = function(x, y) {
  this._x = x;
  this._y = y;
};

CartesianPortPosition.prototype = {
  getX: function() {
    return this._x;
  },

  getY: function() {
    return this._y;
  }
};

module.exports = CartesianPortPosition;
