/**
 * dummyLayout.js
 *
 * This takes an existing graph and lays it out simply in O(n*m) time, where n
 * is the number of vertices in the top level and m is the maximal number of
 * ports that any of those vertices has.
 *
 * @author John O'Brien.
 */

var CardinalPortPosition = require('./../model/cardinalPortPosition');
var CardinalDirection = require('./../enum/cardinalDirection');


// Lay out an existing graph instance.

function layOutGraph(graph) {
  var vertices = graph.get('vertices');
  //loop for laying out the vertices
  var a = 0;
  //console.log(vertices.length);
  for(var i = 0; i < Math.sqrt(vertices.length) && a < vertices.length - 1; i++){
	for(var g = 0; g < Math.sqrt(vertices.length) && a < vertices.length - 1; g++){  
      if (vertices[i].get('isPinned') === false) {
        vertices[a].set('position', {x: i * 100, y: g * 100});

        /*var ins = vertices[i].get('inputs');
        var outs = vertices[i].get('outputs');

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
        }*/
      }
      //console.log(a);
      a++;
	}
  }
}
module.exports = layOutGraph;
