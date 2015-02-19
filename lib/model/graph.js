/**
 * graph.js
 * @author John O'Brien
 *
 * Definition for the Graph class. The Graph class holds on to every node
 * and connection in the entire graph.
 */

/**
 * Creates a new graph.
 * @constructor
 *
 * @param {Array} nodes - An array containing node objects.
 * @param {Array} connections - An array containing connection objects for just
 *                      these tops level nodes.
 */
var Graph = function(nodes, connections) {
  this._nodes = nodes || [];
  this._connections = connections || [];

  this._nodesById = {};
  this._nodes.forEach(function(node) {
    this._nodesById[node.getId()] = node;
  }.bind(this));
};

/**
 * Getter method for the nodes property.
 * @method getNodes
 * @returns {Array} An array of vertices in the graph.
 */
Graph.prototype.getNodes = function(){
  return this._nodes;
};

/**
 * Retrieve a specific vertex in the graph using its id.
 * @method getNodeById
 * @param {Number} id - The ID of the vertex to retrieve.
 * @returns {Vertex} The specified Vertex.
 */
Graph.prototype.getNodeById = function(id) {
  return this._nodesById[id] || null;
};

/**
 * Getter method for the connections property.
 * @method getConnections
 * @returns {Array} An array of connections between vertices in the graph.
 */
Graph.prototype.getConnections = function(){
  return this._connections;
};

// Make the Graph class available to other modules.
module.exports = Graph;
