/**
 * dummyLayout.js
 *
 * This takes an existing graph and lays it out simply in O(n*m) time, where n
 * is the number of vertices in the top level and m is the maximal number of
 * ports that any of those vertices has.
 *
 * @author John O'Brien.
 */

var Graph = require('./../model/graph');
var Vertex = require('./../model/vertex');
var Port = require('./../model/port');
var CardinalPortPosition = require('./../model/cardinalPortPosition');
var CardinalDirection = require('./../enum/cardinalDirection');


// Lay out an existing graph instance.

function layOutGraph(graph) {
  var vertices = graph.get('vertices');
  //loop for laying out the vertices
  for(var i = 0; i < vertices.length; i++){
    if (!vertices[i].get('isPinned')) {
      vertices[i].set('position', {x: i * 20, y: i * 20});

      var ins = vertices[i].get('inputs');
      var outs = vertices[i].get('outputs');

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
}
module.exports = layOutGraph;
