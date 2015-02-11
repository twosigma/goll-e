/**
 * port.js
 *
 * Definition for the Port class. Ports are the points on a Node where
 * connections attach to or from the node. They can be either inputs
 * or outputs.
 */

/**
 * Constructor function.
 *
 * @param id - The Port's unique identifier.
 * @param type - The type of port. Valid options include "input" or "output".
 */
var Port = function(id,type) {
	this.id = id || 0;
	this.x = 0;
	this.y = 0;
	this.type = type;
};

/**
 * Getter method for the id property.
 */
Port.prototype.getID = function() {
	return id;
};

/**
 * Getter method for returning an xy-coordinate pair representing the Port's
 * position in 2D space.
 */
Port.prototype.getPos = function() {
	return [this.x, this.y];
};

/**
 * Getter method for the type property.
 */
Port.prototype.getType = function() {
	return this.type;
};
