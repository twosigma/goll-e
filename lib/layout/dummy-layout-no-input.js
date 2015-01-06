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
var graph;

function buildGraph(nodes_and_connections) {
	var nodes = [];
	for(var i=0; i<4; i++){
		var portIn =new Port(i+"01", "input");
		var portOut=new Port(i+"02", "output");
		var node = new Node(i,[portIn] ,[portOut], [], null);
		node.x=i*2;
		node.y=i*2;
		nodes.push(node);
	}
	var conns = [];
	conns.push(connection({
			sourceNodeId: "0",
			SourcePortId: "002",
			targetNodeId: "3",
			targetPortId: "301"
			// attributes
			// styles
			}));
	graph = new Graph(nodes, conns);
}