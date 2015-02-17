/**
 * edge.js
 * @author Salvador Abate
 * Definition for the edge class. An edge is the linkage between a
 * Node's Output and another (potentially different) node's Input.
 * 
 * Alternatively, in the situation where a node is contained within another node,
 * the containee can have an edge from one of its Outputs to one of the
 * container's Outputs. The same applies for Inputs.
 */

/**
 * Creates a new edge.
 * @constructor
 *
 * @param id - The edge's unique identifier.
 * @param from - The Output object that is the edge's source.
 * @param to - The Input object that is the edge's target.
 * @param metadata - A standard JavaScript object containing key-value metadata.
 */
var Edge = function(id, from, to, metadata) {
  this._id = id || 0;
  this._to = to || null;
  this._from = from || null;
  this._metadata = metadata || {};
};

/**
 * @method getId - Getter method for the id property.
 */
Edge.prototype.getId = function() {
  return this._id;
};

/**
 * @method getTo - Getter method for the to property.
 */
Edge.prototype.getTo = function() {
  return this._to;
};

/**
 * @method getFrom - Getter method for the from property.
 */
Edge.prototype.getFrom = function() {
  return this._from;
};

// Make the Edge object available to other modules.
module.exports = Edge;
