/**
 * Defines a position of an IO using x, y from upper left
 *
 * @class CardinalPortPosition
 * @param {Number} x - The x-axis coordinate of the position.
 * @param {Number} y - The y-axis coordinate of the position.
 */
var CartesianPortPosition = function(x, y) {
  this._x = x;
  this._y = y;
};

CartesianPortPosition.prototype = {
  /**
   * Getter method which returns the x-axis component of the position.
   * @method getX
   * @returns {Number} The x-axis component of the position.
   */
  getX: function() {
    return this._x;
  },

  /**
   * Getter method which returns the y-axis component of the position.
   * @method getY
   * @returns {Number} The y-axis component of the position.
   */
  getY: function() {
    return this._y;
  }
};

module.exports = CartesianPortPosition;
