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
  'use strict';

  this._nodes = nodes || [];
  this._connections = connections || [];

  this._nodesById = {};
  this._nodes.forEach(function(node) {
    this._nodesById[node.getId()] = node;
  }.bind(this));
};

/**
 * @method getNodes - Getter method for the nodes property.
 */
Graph.prototype.getNodes = function(){
  'use strict';
  return this._nodes;
};

Graph.prototype.getNodeById = function(id) {
  'use strict';
  return this._nodesById[id] || null;
};

/**
 * @method getConnections - Getter method for the connections property.
 */
Graph.prototype.getConnections = function(){
  'use strict';
  return this._connections;
};

// Make the Graph class available to other modules.
module.exports = Graph;
