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
 * @param nodes - An array containing node objects.
 * @param connections - An array containing connection objects for just
 *                      these tops level nodes.
 */
var Graph = function(nodes, connections) {
  this._nodes = nodes || [];
  this._connections = connections || [];
};

/**
 * @method getNodes - Getter method for the nodes property.
 */
Graph.prototype.getNodes = function(){
  return this._nodes;
};

/**
 * @method getConnections - Getter method for the connections property.
 */
Graph.prototype.getConnections = function(){
  return this._connections;
};

// Make the Graph class available to other modules.
module.exports = Graph;
