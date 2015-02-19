/**
 * graph.js
 * @author John O'Brien
 *
 * Definition for the Graph class. The Graph class holds on to every vertex
 * and edge in the entire graph.
 */

/**
 * Creates a new graph.
 * @constructor
 *
 * @param vertices - An array containing vertex objects.
 * @param edges - An array containing edge objects for just
 *                      these tops level vertices.
 */
var Graph = function(vertices, edges) {
  this._vertices = vertices || [];
  this._edges = edges || [];

  this._verticesById = {};
  this._vertices.forEach(function(vertex) {
    this._verticesById[vertex.getId()] = vertex;
  }.bind(this));
};

/**
 * @method getVertices - Getter method for the vertices property.
 */
Graph.prototype.getVertices = function(){
  return this._vertices;
};

Graph.prototype.getVertexById = function(id) {
  return this._verticesById[id] || null;
};

/**
 * @method getEdges - Getter method for the connections property.
 */
Graph.prototype.getEdges = function(){
  return this._edges;
};

// Make the Graph class available to other modules.
module.exports = Graph;
