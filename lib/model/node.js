/**
 * node.js
 *
 * Definition for the Node class. A Node is a composable data structure that
 * contains a collection of Inputs and Outputs, a list of UI styles, and
 * arbitrary key-value metadata. Nodes can also contain other nodes.
 */

/**
 * Constructor function.
 *
 * @param id - The Node's unique identifier.
 * @param inputs - An array containing the Node's Inputs.
 * @param outputs - An array containing the Node's Outputs.
 * @param styles - An array of strings which contain the styles that will be
 *                 applied to the node in the visualization.
 * @param metadata - A standard JS object containing key-value metadata.
 */
var Node = function(id, inputs, outputs, styles, metadata) {
	this.id = id || 0;
	this.inputs = inputs || [];
	this.outputs = outputs || [];
	this.styles = styles || [];
	this.metadata = metadata || {};
	this.x = 0;
	this.y = 0;
	this.auto = true;
};

/**
 * Getter method for the id property.
 */
Node.prototype.getID = function() {
	return this.id;
};

/**
 * Getter method for returning an xy-coordinate pair representing the Node's
 * position in 2D space.
 */
Node.prototype.getPos = function() {
	return{
		x: this.x,
		y: this.y
	};
};

/**
 * Setter method for setting an xy-coordinate pair representing the Node's
 * position in 2D space.
 */
Node.prototype.setPos = function(x,y) {
	this.x = x;
	this.y = y;

};

/**
 * Getter method for the inputs property.
 */
Node.prototype.getIns = function() {
	return this.inputs;
};

/**
 * Getter method for the outputs property.
 */
Node.prototype.getOuts = function() {
	return this.outputs;
};

/**
 * Getter method for the metadata property.
 */
Node.prototype.getMeta = function() {
	return this.metadata;
};

/**
 * Getter method for the styles property.
 */
Node.prototype.getStyles = function() {
	return this.styles;
};

// Make the Node object available to other modules.
module.exports = Node;
