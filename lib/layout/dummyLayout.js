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
var CardinalDirection = require('./../enum/cardinalDirection');


// Lay out an existing graph instance.

function layOutGraph(graph) {
  var nodes = graph.get('nodes');
  //loop for laying out the nodes
  for(var i = 0; i < nodes.length; i++){
    nodes[i].set('position', {x: i * 2, y: i * 2});
	
    var ins = nodes[i].get('inputs');
    var outs = nodes[i].get('outputs');
    var position;
	
    for(var iterator = 0; iterator < ins.length; iterator++) {
      position = new CardinalPortPosition({
        direction: CardinalDirection.EAST,
        percentage: 0.5
      });
      ins[iterator].set('position', position);
    }
	
    for(iterator = 0; iterator < outs.length; iterator++) {
      position = new CardinalPortPosition({
        direction: CardinalDirection.WEST,
        percentage: 0.5
      });
      outs[iterator].set('position', position);
    }
	
  }
}
module.exports = layOutGraph;