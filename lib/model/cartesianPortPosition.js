/**
 * Defines a position of an IO using x, y from upper left
 *
 * @class CardinalPortPosition
 * @param {CardinalDirection} direction
 * @param {Number} (unitless)
 */
var CartesianPortPosition = function(x, y) {
  'use strict';
  this._x = x;
  this._y = y;
};

CartesianPortPosition.prototype = {
  getX: function() {
    'use strict';
    return this._x;
  },

  getY: function() {
    'use strict';
    return this._y;
  }
};

module.exports = CartesianPortPosition;
