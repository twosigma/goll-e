/**
 * dummyLayoutV1.js
 *
 * this dumps a fake graph
 *
 * @author John O'Brien. 
 */

// Create a graph instance.


function buildGraph() {
  var lib = './../';
  var Graph = require(lib + 'model/graph');
  var Node = require(lib + 'model/node');
  var Port = require(lib + 'model/port');
  var CardinalPortPosition = require(lib + 'model/cardinalPortPosition');
  var nodes = [];
  //loop for building the nodes
  for(var i =  0; i < 4; i++){
    //creates the ports
    var portIn = new Port( ( i * 100 ) + 01, 'input');
    if( i === 3 ){
      portIn.setPosition(CardinalPortPosition('S', 0));
    }else{
      portIn.setPosition(CardinalPortPosition('E', 0.5));
    }
	
    var portOut=new Port((  i * 100 ) + 02 , 'output');
    if(i === 0){
      portOut.setPosition(CardinalPortPosition('N', 1));
    }else{
      portIn.setPosition(CardinalPortPosition('W', 0.5));
    }
	
    //adds the ports
    var node = new Node(i,[portIn] ,[portOut], [], null);
	
    //'Random' locations
    node.setPos(i * 2, i * 2);
	
    nodes.push(node);
  }
  
  var conns = [];
  //a 'Random' connection
  
	
}

module.exports = buildGraph;