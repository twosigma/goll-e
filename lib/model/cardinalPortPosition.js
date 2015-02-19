/**
 * cardinalPortPosition.js
 * @author Julian Boilen
 *
 * Definition for the CardinalPortPosition class.
 */

/**
 * Defines a position of an IO using N/S/E/W and a percentage
 *
 * @class CardinalPortPosition
 * @param {CardinalDirection} direction Enumerated value representing the
 * cardinal direction that the IO will be placed on (N/S/E/W).
 * @param {Number} percentage a number in the range [0, 100] as measured from the top left corner
 */
var CardinalPortPosition = function(direction, percentage) {
  this._direction = direction;
  this._percentage = percentage;
};

/**
 * Setter method for setting an xy-coordinate pair representing the Port's
 * position in 2D space.
 * @method setPos
 * @param {CardinalDirection} direction - cardinal direction (N,S,E,W) in which the port is located on the node.
 * @param {number} percentage - percentage (from left to right or bottom to top)
 * in which the port is located on the cardinal direction specified by the
 * direction parameter.
 */
CardinalPortPosition.prototype.setPos = function(direction, percentage) {
  this._direction = direction;
  this._percentage = percentage;
};

/**
 * Set the direction.
 * @method setDirection
 * @param {CardinalDirection} newDirection The new direction value.
 */
CardinalPortPosition.prototype.setDirection = function(newDirection) {
  this._direction = newDirection;
};

/**
 * Set the percentage.
 * @method setPercentage
 * @param {Number} newPercentage The new percentage value.
 */
CardinalPortPosition.prototype.setPercentage = function(newPercentage) {
  this._percentage = newPercentage;
};

/**
 * Retrieve the direction.
 * @method getDirection
 * @returns {CardinalDirection} The direction.
 */
CardinalPortPosition.prototype.getDirection = function() {
  return this._direction;
};

/**
 * Retrieve the percentage.
 * @method getPercentage
 * @returns {Number} The percentage.
 */
CardinalPortPosition.prototype.getPercentage = function() {
  return this._percentage;
};

module.exports = CardinalPortPosition;
