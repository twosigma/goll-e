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
/*global Node:true*/
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
 * Getter method for the id property.
 * @method getId
 * @returns {Number} The Node's ID.
 */
Node.prototype.getId = function() {
  return this._id;
};

/**
 * Getter method for returning an xy-coordinate pair representing the Node's
 * position in 2D space.*
 * @method getPosition
 * @returns {Object} The vertex's position.
 */
Node.prototype.getPosition = function() {
  return {
    x: this._x,
    y: this._y
  };
};

/**
 * Setter method for setting an xy-coordinate pair representing the Node's
 * position in 2D space.
 * @method setPosition
 * @param {Number} x - The x-axis coordinate of the vertex's position.
 * @param {Number} y - The y-axis coordinate of the vertex's position.
 */
Node.prototype.setPosition = function(x, y) {
  this._x = x;
  this._y = y;
  this._pinned = true;
};

/**
 * Returns whether the vertex is pinned or not.
 * @method isPinned
 * @returns {Boolean} - True if the vertex is pinned. False otherwise.
 */
Node.prototype.isPinned = function() {
  return this._pinned;
};

/**
 * Getter method for the inputs property.
 * @method getInputs
 * @returns {Array} - An array containing the vertex's input ports.
 */
Node.prototype.getInputs = function() {
  return this._inputs;
};

/**
 * Getter method for the outputs property.
 * @method getOutputs
 * @returns {Array} - An array containing the vertex's output ports.
 */
Node.prototype.getOutputs = function() {
  return this._outputs;
};

/**
 * Getter method for the metadata property.
 * @method getMeta
 * @returns {Array} - An array containing the vertex's metadata.
 */
Node.prototype.getMeta = function() {
  return this._metadata;
};

/**
 * Getter method for the styles property.
 * @method getStyles
 * @returns {Array} - An array containing the vertex's styles.
 */
Node.prototype.getStyles = function() {
  return this._styles;
};

// Make the Node object available to other modules.
module.exports = Node;
