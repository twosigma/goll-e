/**
 * dummyLayoutV1.js
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
  for(var i =  0; i < 4; i++){
    //creates the ports
    var portIn = new Port( ( i * 100 ) + 01, 'input');
    if( i === 3 ){
      portIn.setPosition(cardinalPortPosition('S', 0));
    }else{
      portIn.setPosition(cardinalPortPosition('E', 0.5));
    }
	
    var portOut=new Port((  i * 100 ) + 02 , 'output');
    if(i === 0){
      portOut.setPosition(cardinalPortPosition('N', 1));
    }else{
      portIn.setPosition(cardinalPortPosition('W', 0.5));
    }
	
    //adds the ports
    var node = new Node(i,[portIn] ,[portOut], [], null);
	
    //'Random' locations
    nodes[i].setPos(i * 2, i * 2);
	
    nodes.push(node);
  }
  
  var conns = [];
  //a 'Random' connection
  conns.push(connection({
    sourceNodeId: '0',
    SourcePortId: '002',
    targetNodeId: '3',
    targetPortId: '301'
    // attributes
    // styles
  }));
	nodes_and_connections._nodes=nodes;
	nodes_and_connections._connections=conns;
}