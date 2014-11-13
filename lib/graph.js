/**
 * graph.js
 * @author John O'Brien
 *
 * Definition for the Graph class. The Graph class holds on to every node
 * and connection in the entire graph and has several helper methods
 * for manipulating them..
 */

/**
 * Constructor function.
 *
 * @param nodes - An array containing node objects.
 * @param connections - An array containing connection objects for just
 *                      these tops level nodes.
 */
var Graph = function(nodes, connections) {
	this.nodes = nodes || [];
	this.connections = connections || [];
};

/**
 * Getter method for the nodes property.
 */
Graph.prototype.nodes = function(){
	return this.nodes;
};

/**
 * Getter method for the connections property.
 */
Graph.prototype.connections = function(){
	return this.connections;
};

// Make the Graph class available to other modules.
module.exports = Graph;
