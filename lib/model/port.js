/**
 * port.js
 *
 * Definition for the Port class. Ports are the points on a vertex where
 * connections attach to or from the vertex. They can be either inputs
 * or outputs.
 */

/**
 * @class Port
 *
 * @param id - The Port's unique identifier.
 * @param type {IOType} - The type of port. Valid options include "input" or "output".
 * @param position {CardinalPortPosition} - position object describing positioning in the context of the Vertex
 */
var Port = function(id,type,position) {
  this._id = id || 0;
  this._position = position;
  this._type = type;
  this._pinned = false;
};

/**
 * @method getId - Getter method for the id property.
 */
Port.prototype.getId = function() {
  return this._id;
};

/**
 * @method getPosition - Getter method for returning an xy-coordinate pair representing the Port's
 * position in 2D space.
 */
Port.prototype.getPosition = function() {
  return this._position;
};

/**
 * @method setPosition - Setter method for setting a position representing the Port's
 *         position in 2D space.
 * @param position {cardinalPortPOsition} - specifies a position object for the the port.
 */
Port.prototype.setPosition = function(position) {
  this._position = position;
};

/**
 * @method isPinned - Returns whether the port is pinned or not.
 */
Port.prototype.isPinned = function() {
  return this._pinned;
};

/**
* @method setPinned - Pins or unpins the port
* 
* @param pin - A boolean setting the value of pinned to true or false.
*/
Port.prototype.setPinned = function(pin) {
  this._pinned = pin;
};

/**
 * @method getType - Getter method for the type property.
 */
Port.prototype.getType = function() {
  return this._type;
};

// Make the Port object available to other modules.
module.exports = Port;
