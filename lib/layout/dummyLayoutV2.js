/**
 * dummyLayoutV2.js
 *
 * this creates a basic poorly laid out graph
 *
 * @author John O'Brien.
 */


// Create a graph instance.

function buildGraph(graphs) {
  var nodes = graph.getNodes();
  //loop for building the nodes
  for(var i = 0; i < nodes.length; i++){
    nodes[i].setPos(i * 2, i * 2);
	
    var ins = nodes[i].getIns();
    var outs = nodes[i].getOuts();
	
    for(var iterator = 0; iterator < ins.length; iterator++){
      ins[ iterator ].setPosition(cardinalPortPosition('E', 0.5));
    }
	
    for(iterator = 0; iterator < outs.length; iterator++){
      outs[ iterator ].setPosition(cardinalPortPosition('W', 0.5));
    }
	
  }
}
module.exports = buildGraph;