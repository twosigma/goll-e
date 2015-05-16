/**
 * dummyLayout.js
 *
 * This takes an existing graph and lays it out simply in O(n*m) time, where n
 * is the number of vertices in the top level and m is the maximal number of
 * ports that any of those vertices has.
 *
 * @author John O'Brien.
 */


// Lay out an existing graph instance.

function layOutGraph(graph) {
  var vertices = graph.get('vertices');
  //loop for laying out the vertices
  var sidelength = Math.round(Math.sqrt(vertices.length));
  for(var i = 0; i < vertices.length; i++){
    if(vertices[i].get('isPinned') === false){
      vertices[i].set('position', {x: Math.floor(i / sidelength) * 100, y: (i % sidelength) * 100});
    }
  }
}

module.exports = layOutGraph;
