/**
 * port.js
 *
 * Definition for the Port class. Ports are the points on a Node where
 * connections attach to or from the node. They can be either inputs
 * or outputs.
 */

/**
 * Constructor for the Port class.
 *
 * @constructor
 *
 * @param {Number} id - The Port's unique identifier.
 * @param {IOType} type - The type of port. Valid options include 'input' or 'output'.
 * @param {CardinalPortPosition} position object describing positioning in the context of the node
 */
var Port = function(id, type, position) {
  this._id = id || 0;
  this._position = position;
  this._type = type;
  this._pinned = false;
};

/**
 * Getter method for the id property.
 * @method getId
 * @returns {Number} The port's ID.
 */
Port.prototype.getId = function() {
  return this._id;
};

/**
 * Getter method for returning a coordinate pair representing the Port's
 * position in 2D space.
 * @method getPos
 * @returns {CardinalPortPosition} - The port's position in 2D space.
 */
Port.prototype.getPosition = function() {
  return this._position;
};

/**
 * Setter method for setting a coordinate pair representing the Port's
 * position in 2D space.
 *
 * @method setPos
 * @param {CardinalPortPosition} position - cardinal direction (N,S,E,W) in which
 * the port is located on the node.
 * @param {Number} percentage - percentage (from left to right or bottom to top)
 * in which the port is located on the cardinal direction specified by
 * the direction parameter.
 */
Port.prototype.setPosition = function(position) {
  this._position = position;
};

/**
 * Returns whether the port is pinned or not.
 * @method isPinned
 * @returns {Boolean} True if the port is pinned.
 */
Port.prototype.isPinned = function() {
  return this._pinned;
};

/**
 * Getter method for the type property.
 * @method getType
 * @returns {IOType} The port's type.
 */
Port.prototype.getType = function() {
  return this._type;
};

// Make the Port object available to other modules.
module.exports = Port;
