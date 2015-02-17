/**
 * node.js
 *
 * Definition for the Node class. A Node is a composable data structure that
 * contains a collection of Inputs and Outputs, a list of UI styles, and
 * arbitrary key-value metadata. Nodes can also contain other nodes.
 */

/**
 * Creates a new node.
 * @constructor
 * 
 * @param id - The Node's unique identifier.
 * @param inputs - An array containing the Node's Inputs.
 * @param outputs - An array containing the Node's Outputs.
 * @param styles - An array of strings which contain the styles that will be
 *                 applied to the node in the visualization.
 * @param metadata - A standard JS object containing key-value metadata.
 */
var Node = function(id, inputs, outputs, styles, metadata) {
  this._id = id || 0;
  this._inputs = inputs || [];
  this._outputs = outputs || [];
  this._styles = styles || [];
  this._metadata = metadata || {};
  this._x = 0;
  this._y = 0;
  this._pinned = false;
};

/**
 * @method getId - Getter method for the id property.
 */
Node.prototype.getId = function() {
  return this._id;
};

/**
 * @method getPosition - Getter method for returning an xy-coordinate pair representing the Node's
 *         position in 2D space.
 */
Node.prototype.getPosition = function() {
  return {
    x: this._x,
    y: this._y
  };
};

/**
 * @method setPosition - Setter method for setting an xy-coordinate pair representing the Node's
 *         position in 2D space.
 */
Node.prototype.setPosition = function(x, y) {
  this._x = x;
  this._y = y;
  this._pinned = true;

};

/**
* @method isPinned - Returns whether the node is pinned or not. 
*/
Node.prototype.isPinned = function() {
  return this._pinned;
};

/**
 * @method getInputs - Getter method for the inputs property.
 */
Node.prototype.getInputs = function() {
  return this._inputs;
};

/**
 * @method getOutputs - Getter method for the outputs property.
 */
Node.prototype.getOutputs = function() {
  return this._outputs;
};

/**
 * @method getMeta - Getter method for the metadata property.
 */
Node.prototype.getMeta = function() {
  return this._metadata;
};

/**
 * @method getStyles - Getter method for the styles property.
 */
Node.prototype.getStyles = function() {
  return this._styles;
};

// Make the Node object available to other modules.
module.exports = Node;
