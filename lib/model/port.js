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
 * @param direction - cardinal direction (N,S,E,W) in which the port is located on the node.
 * @param percentage - percentage (from left to right or bottom to top) in which the port is located
 * 					   on the cardinal direction specified by the direction parameter.
 */
var Port = function(id,type,direction,percentage) {
	this.id = id || 0;
	this.direction = direction;
	this.percentage = percentage;
	this.type = type;
};

/**
 * Getter method for the id property.
 */
Port.prototype.getID = function() {
	return this.id;
};

/**
 * Getter method for returning an xy-coordinate pair representing the Port's
 * position in 2D space.
 */
Port.prototype.getPos = function() {
	return{
		direction: this.direction,
		percentage: this.percentage
	};
};

/**
 * Setter method for setting an xy-coordinate pair representing the Port's
 * position in 2D space.
 */
Port.prototype.setPos = function(x,y) {
	this.direction = x;
	this.percentage = y;
};

/**
 * Getter method for the type property.
 */
Port.prototype.getType = function() {
	return this.type;
};

// Make the Port object available to other modules.
module.exports = Port;
