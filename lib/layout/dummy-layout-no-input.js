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
	//loop for building the nodes
	for(var i=0; i<4; i++){
		//creates the ports
		var portIn =new Port((i*100)+01, "input");
		if(i=3){
			portIn.setLocation("S", 0);
		}else{
			portIn.setLocation("E", .5);
		}
		var portOut=new Port((i*100)+02, "output");
		if(i=0){
			portOut.setLocation("N", 1);
		}else{
			portIn.setLocation("W", .5);
		}
		//adds the ports
		var node = new Node(i,[portIn] ,[portOut], [], null);
		//"Random" locations
		node.x=i*2;
		node.y=i*2;
		nodes.push(node);
	}
	var conns = [];
	//a "Random" connection
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