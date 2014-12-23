/**
 * dummy-layout.js
 *
 * this dumps a fake graph
 *
 * @author John O'Brien.
 */

var Node = require('../model/node.js');
var Graph = require('../model/graph.js');
var Port = require('../model/port.js');

// Create a graph instance.
var graph = new Graph();

function buildGraph(nodes_and_connections) {
	var nodes = [];
	for(int i=0; i<4; i++){
		var node = new Node(i, {new Port(i+"01", "input")},{new Port(i+"02", "output")}, {"null"}, null);
		node.x=i*2;
		node.y=i*2;
		graph.nodes.push(node);
	}
}