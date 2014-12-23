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
	//based on springLayout
	//https://code.google.com/p/jung/source/browse/branches/guava/jung/jung-algorithms/src/main/java/edu/uci/ics/jung/algorithms/layout/SpringLayout2.java?r=19
	/*var nodes = nodes_and_connections.nodes;
	var connections = nodes_and_connections.connections;
	for (i = 0; i < nodes.length; i++) { 
		if(nodes[i].autolayout===true) {
			
		}
	
	}*/
	/*protected double*/ stretch = 0.70;
    //protected Function<? super E, Integer> lengthFunction;
    /*protected int*/ repulsion_range_sq = 100 * 100;
    /*protected double*/ force_multiplier = 1.0 / 3.0;


}
