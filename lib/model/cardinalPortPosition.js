var CardinalDirection = require('../enum/cardinalDirection');
/**
 * Defines a position of a Port using N/S/E/W and a percentage
 * 
 * @class CardinalPortPosition
 * @param {CardinalDirection} direction
 * @param {Number} percentage a number in the range [0, 100] as measured from the top left corner
 */
var CardinalPortPosition = function(direction,percentage) {
  this._direction = direction;
  this._percentage = percentage;
};

/**
 * @function getDirection
 */
CardinalPortPosition.prototype.getDirection = function() {
  return this._direction;
};

/**
 * @method Setter method for setting an xy-coordinate pair representing the Port's
 *         position in 2D space.
 * @param direction - cardinal direction (N,S,E,W) in which the port is located on the node.
 * @param percentage - percentage (from left to right or bottom to top) in which the port is located
 *             on the cardinal direction specified by the direction parameter.
 */
CardinalPortPosition.prototype.setPos = function(direction,percentage) {
  this._direction = direction;
  this._percentage = percentage;
};

CardinalPortPosition.prototype.setDirection = function(newDirection) {
  this._direction = newDirection;
};

CardinalPortPosition.prototype.setPercentage = function(newPercentage) {
  this._percentage = newPercentage;
};

CardinalPortPosition.prototype.getDirection = function() {
  return this._direction;
};

CardinalPortPosition.prototype.getPercentage = function() {
  return this._percentage;
};

module.exports = CardinalPortPosition;
