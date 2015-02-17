/**
 * vertex.js
 *
 * Definition for the Vertex class. A Vertex is a composable data structure that
 * contains a collection of Inputs and Outputs, a list of UI styles, and
 * arbitrary key-value metadata. Vertices can also contain other Vertices.
 */

/**
 * Creates a new vertex.
 * @constructor
 * 
 * @param id - The Vertex's unique identifier.
 * @param inputs - An array containing the Vertex's Inputs.
 * @param outputs - An array containing the Vertex's Outputs.
 * @param styles - An array of strings which contain the styles that will be
 *                 applied to the vertex in the visualization.
 * @param metadata - A standard JS object containing key-value metadata.
 */
var Vertex = function(id, inputs, outputs, styles, metadata) {
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
Vertex.prototype.getId = function() {
  return this._id;
};

/**
 * @method getPosition - Getter method for returning an xy-coordinate pair representing the Vertex's
 *         position in 2D space.
 */
Vertex.prototype.getPosition = function() {
  return{
    x: this._x,
    y: this._y
  };
};

/**
 * @method setPosition - Setter method for setting an xy-coordinate pair representing the Vertex's
 *         position in 2D space.
 */
Vertex.prototype.setPosition = function(x, y) {
  this._x = x;
  this._y = y;
  this._pinned = true;

};

/**
* @method isPinned - Returns whether the vertex is pinned or not. 
*/
Vertex.prototype.isPinned = function() {
  return this._pinned;
};

/**
 * @method isPinned - Returns whether the vertex is pinned or not.
 */
Port.prototype.isPinned = function() {
  return this._pinned;
};

/**
 * @method getInputs - Getter method for the inputs property.
 */
Vertex.prototype.getInputs = function() {
  return this._inputs;
};

/**
 * @method getOutputs - Getter method for the outputs property.
 */
Vertex.prototype.getOutputs = function() {
  return this._outputs;
};

/**
 * @method getMeta - Getter method for the metadata property.
 */
Vertex.prototype.getMeta = function() {
  return this._metadata;
};

/**
 * @method getStyles - Getter method for the styles property.
 */
Vertex.prototype.getStyles = function() {
  return this._styles;
};

// Make the Vertex object available to other modules.
module.exports = Vertex;
