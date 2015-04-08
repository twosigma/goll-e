/**
 * dummyLayout.js
 *
 * This takes an existing graph and lays it out simply in O(n*m) time, where n
 * is the number of vertices in the top level and m is the maximal number of
 * ports that any of those vertices has.
 *
 * @author John O'Brien.
 */

var CardinalPortPosition = require('./../model/layout/cardinalPortPosition');
var CardinalDirection = require('./../enum/cardinalDirection');


// Lay out an existing graph instance.

function layOutGraph(graph) {
  var vertices = graph.get('vertices');
  var layout;
  var portLayout;

  //loop for laying out the vertices
  for(var i = 0; i < vertices.length; i++){
    layout = vertices[i].getLayout();
    if (!layout.get('isPinned')) {
      layout.set('position', {x: i * 20, y: i * 20});

      var ins = vertices[i].get('inputs');
      var outs = vertices[i].get('outputs');

      var position;

      for(var iterator = 0; iterator < ins.length; iterator++) {
        portLayout = ins[iterator].getLayout();
        position = new CardinalPortPosition({
          direction: CardinalDirection.EAST,
          percentage: 0.5
        });
        portLayout.set('position', position);
      }

      for(iterator = 0; iterator < outs.length; iterator++) {
        portLayout = outs[iterator].getLayout();
        position = new CardinalPortPosition({
          direction: CardinalDirection.WEST,
          percentage: 0.5
        });
        portLayout.set('position', position);
      }
    }

  }
}
module.exports = layOutGraph;
