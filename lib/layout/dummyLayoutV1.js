/**
 * dummyLayoutV1.js
 *
 * this dumps a fake graph
 *
 * @author John O'Brien. 
 */
var Graph = require('./../model/graph');
var Node = require('./../model/node');
var Port = require('./../model/port');
var CardinalPortPosition = require('./../model/cardinalPortPosition');
// Create a graph instance.


function buildGraph() {
  var nodes = [];
  //loop for building the nodes
  for(var i = 0; i < 4; i++){
    //creates the ports
    var portIn = new Port(( i * 100) + 01, 'input');
    if(i === 3){
      portIn.setPosition(new CardinalPortPosition('S', 0));
    } else {
      portIn.setPosition(new CardinalPortPosition('E', 0.5));
    }
	
    var portOut=new Port((  i * 100 ) + 02, 'output');
    if(i === 0){
      portOut.setPosition(new CardinalPortPosition('N', 1));
    } else {
      portIn.setPosition(new CardinalPortPosition('W', 0.5));
    }
	
    //adds the ports
    var node = new Node(i,[portIn] ,[portOut], [], null);
	
    //'Random' locations
    node.setPosition(i * 2, i * 2);
	
    nodes.push(node);
  }
  
  var conns = [];
  //a 'Random' connection
  
	
}

module.exports = buildGraph;