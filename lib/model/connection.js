/**
 * connection.js
 *
 * Definition for the Connection class. A Connection is the linkage between a
 * Node's Output and another (potentially different) node's Input.
 * 
 * Alternatively, in the situation where a node is contained within another node,
 * the containee can have a connection from one of it's Outputs to one of the
 * container's Outputs. The same applies for Inputs.
 */

/**
 * Constructor function.
 *
 * @param id - The Connection's unique identifier.
 * @param from - The Output object that is the connection's source.
 * @param to - The Input object that is the connection's target.
 * @param metadata - A standard JavaScript object containing key-value metadata.
 */
var Connection = function(id, from, to, metadata) {
	this.id = id || 0;
	this.to = to || null;
	this.from = from || null;
};

/**
 * Getter method for the id property.
 */
Connection.prototype.getId = function() {
	return this.id;
};

/**
 * Getter method for the to property.
 */
Connection.prototype.getTo = function() {
	return this.from;
};

/**
 * Getter method for the from property.
 */
Connection.prototype.getFrom = function() {
	return this.to;
};

// Make the Connection object available to other modules.
module.exports = Connection;
