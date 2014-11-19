/**
 * force-directed-layout.js
 *
 * This module contains logic for performing the force-directed layout
 * algorithm on a graph.
 *
 * @author John O'Brien.
 */

var Node = require('../model/node.js');
var Graph = require('../model/graph.js');

// Create a graph instance.
var graph = new Graph();

function buildGraph(nodes_and_connections) {
	var nodes = nodes_and_connections.nodes;
	var connections = nodes_and_connections.connections;
	for (i = 0; i < nodes.length; i++) { 
		if(nodes[i].autolayout===true) {
			
		}
	
	}


}
