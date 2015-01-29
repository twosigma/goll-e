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
	return this.id;
};

/**
* Function to change the position description of the port in the node from the 
* defined language to a coordinate plane.
*
* @param cardinal - cardinal direction in which the port is located (N,S,E,W).
* @param percentage - percentage of the way the port is located in a given cardinal direction.
*/
Port.prototype.cardinalToCoordinate = function(cardinal,percentage) {
	if(cardinal == "N"){
		this.y = 100;
		this.x = percentage;
	}
	if(cardinal == "S"){
		this.y = 0;
		this.x = precentage;
	}
	if(cardinal == "E"){
		this.x = 100;
		this.y = percentage;
	}
	if(cardinal == "W"){
		this.x = 0;
		this.y = percentage;
	}
};

/**
 * Getter method for returning an xy-coordinate pair representing the Port's
 * position in 2D space.
 */
Port.prototype.getPos = function() {
	return [this.x,this.y];
};

/**
 * Setter method for an xy-coordinate pair representing the Port's
 * position in 2D space.
 */
Port.prototype.setPos = function(x,y) {
	this.x = x;
	this.y = y;
};
/**
 * Getter method for the type property.
 */
Port.prototype.getType = function() {
	return this.type;
};

// Make the Port object available to other modules.
module.exports = Port;