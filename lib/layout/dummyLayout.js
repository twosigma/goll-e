/**
 * dummyLayout.js
 *
 * This takes an existing graph and lays it out poorly.
 *
 * @author John O'Brien.
 */

var Graph = require('./../model/graph');
var Node = require('./../model/node');
var Port = require('./../model/port');
var CardinalPortPosition = require('./../model/cardinalPortPosition');


// Lay out an existing graph instance.

function layOutGraph(graph) {
  var nodes = graph.getNodes();
  //loop for laying out the nodes
  for(var i = 0; i < nodes.length; i++){
    nodes[i].setPosition(i * 2, i * 2);

    var ins = nodes[i].getInputs();
    var outs = nodes[i].getOutputs();

    for(var iterator = 0; iterator < ins.length; iterator++){
      ins[ iterator ].setPosition(new CardinalPortPosition('E', 0.5));
    }

    for(iterator = 0; iterator < outs.length; iterator++){
      outs[ iterator ].setPosition(new CardinalPortPosition('W', 0.5));
    }
  }
}
module.exports = layOutGraph;
