/**
 * port.js
 *
 * Definition for the Port class. Ports are the points on a Node where
 * connections attach to or from the node. They can be either inputs
 * or outputs.
 */

/**
 * @constructor Constructor function.
 *
 * @param id - The Port's unique identifier.
 * @param type - The type of port. Valid options include "input" or "output".
 * @param {CardinalPortPosition} position object describing positioning in the context of the node
 */
var Port = function(id,type,position) {
  this._id = id || 0;
  this._position = position;
  this._type = type;
  this._pinned = false;
};

/**
 * @method Getter method for the id property.
 */
Port.prototype.getID = function() {
  return this._id;
};

/**
 * @method Getter method for returning an xy-coordinate pair representing the Port's
 * position in 2D space.
 */
Port.prototype.getPosition = function() {
  return this._position;
};

/**
 * @method Setter method for setting an xy-coordinate pair representing the Port's
 *         position in 2D space.
 * @param direction - cardinal direction (N,S,E,W) in which the port is located on the node.
 * @param percentage - percentage (from left to right or bottom to top) in which the port is located
 * 					   on the cardinal direction specified by the direction parameter.
 */
Port.prototype.setPosition = function(position) {
  this._position = position;
};

/**
 * @method Returns whether the port is pinned or not.
 */
Port.prototype.isPinned = function() {
  return this._pinned;
};

/**
 * @method Getter method for the type property.
 */
Port.prototype.getType = function() {
  return this._type;
};

// Make the Port object available to other modules.
module.exports = Port;
