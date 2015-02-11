/**
 * dummylayoutV2.js
 *
 * this creates a basic poorly laid out graph
 *
 * @author John O'Brien.
 */

var Node = require('../model/node.js');
var Graph = require('../model/graph.js');
var Port = require('../model/port.js');

// Create a graph instance.

function buildGraph(graphs) {
	var nodes = graph.nodes;
	//loop for building the nodes
	for(var i=0; i<nodes.length; i++){
		nodes[i].x=i*2;
		nodes[i].y=i*2;
		var ins = nodes[i].getIns();
		var outs = nodes[i].getOuts();
		for(var numIns = 0; numIns < ins.Length; numIns++){
			ins[numIns].setLocation("E", 0.5);
		}
		for(var numOuts = 0; numOuts < outs.Length; numOuts++){
			outs[numOuts].setLocation("W", 0.5);
		}
	}
}