/**
 * forceDirectedLayout.js
 *
 * This module contains logic for performing the force-directed layout
 * algorithm on a graph.
 *
 * @author John O'Brien.
 */

var dummyLayout = require('./../layout/dummyLayout');
var change = false;
//ideal length
var iLength = 500;
//force strength
var forceStr = 1 / 3;
//stretching force
var stretchForce = 0.70;
//minimum change
var minLimit = 10;
var vertices;
var mGraph;
var vectors;

//Based partially on https://code.google.com/p/jung/source/browse/branches/
//guava/jung/jung-algorithms/src/main/java/edu/uci/ics/jung/algorithms/
//layout/SpringLayout.java?r=19

/**
 * Defines force directed layout algorithm
 *
 * @class forceDirectedLayout
 *
 */


 /**
 * Takes an edge and returns object of lengths.
 *
 * @method getEdgeDistance
 * @param  {edge} edge
 * @return {Object} length contains deltaX, deltaY and distance (hypotenuse)
 */

var getEdgeDistance = function(edge){
  var to = mGraph.getVertexById(edge.get('to').get('ownerVertexId'));
  var from = mGraph.getVertexById(edge.get('from').get('ownerVertexId'));

  var toPos = to.get('position');
  var fromPos = from.get('position');

  var delta = {
    deltaX: toPos.x - fromPos.x,
    deltaY: toPos.y - fromPos.y
  };

  delta.distance = Math.sqrt(Math.pow(delta.deltaX, 2) + Math.pow(delta.deltaY, 2));

  return delta;
};

/**
 * Takes an edge and calculates the repulsion for that edge
 *
 * Returns nothing.
 *
 * @method springForce
 * @param  {edge} edge
 */
var springForce = function(edge){
  //vertex to
  var vertexTo = mGraph.getVertexById(edge.get('to').get('ownerVertexId'));

  //vertex from
  var vertexFrom = mGraph.getVertexById(edge.get('from').get('ownerVertexId'));

  // object of displacements and components
  var distances = getEdgeDistance(edge);

  //x distance between them
  var xLength = distances.deltaX;

  //y distance between them
  var yLength = distances.deltaY;

  //straight line edge length
  var length = distances.distance;

  //checks for both pinned
  if(vertexTo.get('isPinned') === true && vertexFrom.get('isPinned') === true){
    return;
  }

  //hacky solution for length being 0
  if(length === 0){
    length = 0.99;
  }
  //repulsion force calculation
  var force = forceStr * (iLength - length) / length;
  var pwrTo = vertexTo.get('inputs').length + vertexTo.get('outputs').length;
  var pwrFr = vertexFrom.get('inputs').length + vertexFrom.get('outputs').length;

  force = force * Math.pow(stretchForce, (pwrTo + pwrFr - 4));

  //repulsion change in x
  var repulsionX = force * xLength;

  //repulsion change in y
  var repulsionY = force * yLength;

  //attraction x
  var attractionX;

  //attraction y
  var attractionY;

  //math for min length
  if(length < 1){
    attractionX = Math.random() * 10 + 1;
    attractionY = Math.random() * 10 + 1;
  } else {
    attractionX = xLength / (length * length);
    attractionY = yLength / (length * length);
  }
  var len = attractionX * attractionX + attractionY * attractionY;
  //ensures length is positive
  if(len > 0){
    len = Math.sqrt(len);
    attractionX = attractionX / len;
    attractionY = attractionY / len;
  }
  //repulsion minus attraction
  repulsionX = repulsionX - attractionX;
  repulsionY = repulsionY - attractionY;

  var addRepulsion = function(vector, multiplier) {
    if (typeof multiplier !== 'number') {
      multiplier = 1;
    }

    vector.x += repulsionX * multiplier;
    vector.y += repulsionY * multiplier;
    vector.count += 1;
  };

  var toIndex;
  var fromIndex;

  if(vertexTo.get('isPinned') === false && vertexFrom.get('isPinned') === false){
    addRepulsion(vectors.get(vertexTo));

    addRepulsion(vectors.get(vertexFrom), -1);

  }else if(vertexTo.get('isPinned') === false){
    addRepulsion(vectors.get(vertexTo), 2);

  }else if(vertexFrom.get('isPinned') === false){
    addRepulsion(vectors.get(vertexFrom), -2);
  }
};

 /**
 * Takes the graph and re aligns the nodes
 *
 * Returns nothing
 *
 * @method layOutGraph
 * @param  {Graph} graph
 * @return nothing
 */

var layOutGraph = function(graph){
  dummyLayout(graph);
  mGraph = graph;
  vertices = graph.get('vertices');
  vectors = new Map();
  var edgeList = graph.get('edges');
  var runner = true;

  var changePositionInDirection = function(vector, vertex, direction) {
    var position = vertex.get('position');
    if(vector[direction] > 1000) {
      position[direction] = position[direction] + 1000;
    } else if(vector[direction] < -1000) {
      position[direction] = position[direction] - 1000;
    } else {
      position[direction] = position[direction] + vector[direction];
    }
    vertex.set('position', position);
  };

  while(runner){
    for (var a = 0; a < vertices.length; a++){
      vectors.set(vertices[a], {x: 0, y: 0, count: 0});
    }
    change = false;
    for(var i = 0; i < edgeList.length; i++){
      springForce(edgeList[i]);
    }
    for (a = 0; a < vertices.length; a++){
      var curVertex = vertices[a];
      var curVector = vectors.get(curVertex);

      if(curVector.x >= minLimit || curVector.y >= minLimit || curVector.x <= -minLimit || curVector.y <= -minLimit){
        change = true;
      }

      changePositionInDirection(curVector, curVertex, 'x');
      changePositionInDirection(curVector, curVertex, 'y');

    }
    minLimit = minLimit * 10;

    if(change === false){
      runner = false;
    }
    change = false;
  }
};

module.exports = layOutGraph;
