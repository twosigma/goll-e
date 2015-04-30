/**
 * forceDirectedLayout.js
 *
 * This module contains logic for performing the force-directed layout
 * algorithm on a graph.
 *
 * @author John O'Brien.
 */

var CardinalPortPosition = require('./../model/cardinalPortPosition');
var dummyLayout = require('./../layout/dummyLayout');
//var dummyLayout = require('./dummyLayout');
var change = false;
//ideal length
var iLength = 500;
//force strength
var forceStr = 1 / 3;
//stretching force
var stretchForce = 0.70;
//minimum change
var minLimit = 1;
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




/* not yet implemented
function portPositioning(edge){
  var vertexTo = mGraph.getVertexById(edge.get('to').get('ownerVertexId'));
  var vertexFrom = mGraph.getVertexById(edge.get('from').get('ownerVertexId'));
  var xLength = edgeXLength(edge);
  var yLength = edgeYLength(edge);
}*/

//calculates edge length
 /**
     * Takes an edge and returns its length
     *
     * Returns nothing
     *
     * @method edgeLength
     * @param  {edge} edge
     * @return {int} length
     */

var edgeLength = function(edge){
  var to = mGraph.getVertexById(edge.get('to').get('ownerVertexId'));
  var from = mGraph.getVertexById(edge.get('from').get('ownerVertexId'));

  //pythag theorem
  var x = to.get('position').x - from.get('position').x;
  var y = to.get('position').y - from.get('position').y;
  var c = x * x + y * y;

  return Math.sqrt(c);
};

/**
     * Takes an edge and returns its length's x value
     *
     * Returns nothing
     *
     * @method edgeXLength
     * @param  {edge} edge
     * @return {int} length
     */
var edgeXLength = function(edge){
  var to = mGraph.getVertexById(edge.get('to').get('ownerVertexId'));
  var from = mGraph.getVertexById(edge.get('from').get('ownerVertexId'));

  var x = to.get('position').x - from.get('position').x;
  return x;

};

/**
     * Takes an edge and returns its length's y value
     *
     * Returns nothing
     *
     * @method edgeYLength
     * @param  {edge} edge
     * @return {int} length
     */
var edgeYLength = function(edge){
  var to = mGraph.getVertexById(edge.get('to').get('ownerVertexId'));
  var from = mGraph.getVertexById(edge.get('from').get('ownerVertexId'));

  var y = to.get('position').y - from.get('position').y;
  return y;
};

/**
     * Takes an edge and calculates the repulsion for that edge
     *
     * Returns nothing
     *
     * @method springForce
     * @param  {edge} edge
     * @return nothing
     */

var springForce = function(edge){
  //vertex to
  var vertexTo = mGraph.getVertexById(edge.get('to').get('ownerVertexId'));
  //vertex from
  var vertexFrom = mGraph.getVertexById(edge.get('from').get('ownerVertexId'));
  //x distance between them
  var xLength = edgeXLength(edge);
  //y distance between them
  var yLength = edgeYLength(edge);
  //straight line edge length
  var length = edgeLength(edge);
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

  //the minimum movement percentage to consider a move a change
  //constant can be altered for desired effects (higher means less runs lower will
  //be more accurate)
  //var minLimit = 0.1;
  var toIndex;
  var fromIndex;
  if(vertexTo.get('isPinned') === false && vertexFrom.get('isPinned') === false){
    /*vertexTo.set('position', {
      'x': (vertexTo.get('position').x + repulsionX),
      'y': (vertexTo.get('position').y + repulsionY)
    });
  vertexFrom.set('position', {
      'x': vertexFrom.get('position').x - repulsionX,
      'y': vertexFrom.get('position').y - repulsionY

    });*/
    toIndex = vertices.indexOf(vertexTo);
    vectors[toIndex].x += repulsionX;
    vectors[toIndex].y += repulsionY;
    vectors[toIndex].count += 1;
    fromIndex = vertices.indexOf(vertexFrom);
    vectors[fromIndex].x -= repulsionX;
    vectors[fromIndex].y -= repulsionY;
    vectors[fromIndex].count += 1;


  }else if(vertexTo.get('isPinned') === false){
  /*vertexTo.set('position', {
      'x': (vertexTo.get('position').x + repulsionX + repulsionX),
      'y': (vertexTo.get('position').y + repulsionY + repulsionY)
    });*/

    toIndex = vertices.indexOf(vertexTo);
    vectors[toIndex].x += (repulsionX * 2);
    vectors[toIndex].y += (repulsionY * 2);
    vectors[toIndex].count ++;

  }else if(vertexFrom.get('isPinned') === false){
    /*vertexFrom.set('position', {
      'x': vertexFrom.get('position').x - repulsionX - repulsionX,
      'y': vertexFrom.get('position').y - repulsionY - repulsionY
    });*/
    fromIndex = vertices.indexOf(vertexFrom);
    vectors[fromIndex].x -= (repulsionX * 2);
    vectors[fromIndex].y -= (repulsionY * 2);
    vectors[fromIndex].count ++;
  }
  //if(repulsionX > minLimit || repulsionY > minLimit || (repulsionX < -minLimit) || (repulsionY < -minLimit)){
    //change = true;
 // }
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
  //console.log("0");
  mGraph = graph;
  vertices = graph.get('vertices');
  //console.log("1");
  vectors = [];
  var edgeList = graph.get('edges');
  var runner = true;
  //console.log("2");

  //var loops = 1;
  while(runner){
    //console.log("loop " + loops + "\n" + "minLimit: " + minLimit + "\n");
    for (var a = 0; a < vertices.length; a++){
    //console.log("a = " + a);
      vectors.push({x: 0, y: 0, count: 0});
    }
    change = false;
  //console.log("3");
    for(var i = 0; i < edgeList.length; i++){
      springForce(edgeList[i]);
    }
  //console.log("4");
  /*for(i = 0; i < edgeList.length; i++){
      edgeList[i].set('position', {
      'x': (vertexTo.get('position').x + (vectors[i].x/vectors[i].count)),
      'y': (vertexTo.get('position').y + (vectors[i].y/vectors[i].count))
    });
    if((vectors[i].x/vectors[i].count) > minLimit || (vectors[i].y/vectors[i].count) > minLimit || ((vectors[i].x/vectors[i].count) < -minLimit) || ((vectors[i].y/vectors[i].count) < -minLimit)){
        change = true;
      }
    }*/
    for (a = 0; a < vertices.length; a++){
    //console.log(vertices[a].get('position').x + "|" + vertices[a].get('position').x + "|" + vectors[a].x);
    //console.log(vertices[a].get('position').y + "|" + vertices[a].get('position').y + "|" + vectors[a].y + "\n");
      if(vectors[a].x >= minLimit || vectors[a].y >= minLimit || vectors[a].x <= -minLimit || vectors[a].y <= -minLimit){
        change = true;
      }
      if(vectors[a].x > 1000){
        vertices[a].get('position').x = vertices[a].get('position').x + 1000;
      }else if(vectors[a].x < -1000){
         vertices[a].get('position').x = vertices[a].get('position').x - 1000;
      }else{
        vertices[a].get('position').x = vertices[a].get('position').x + vectors[a].x;
      }
      if(vectors[a].y > 1000){
        vertices[a].get('position').y = vertices[a].get('position').y + 1000;
      }else if(vectors[a].y < -1000){
         vertices[a].get('position').y = vertices[a].get('position').y - 1000;
      }else{
        vertices[a].get('position').y = vertices[a].get('position').y + vectors[a].y;
      }

    }
  //console.log("5");
    minLimit = minLimit * 1.2;

    if(change === false){

      runner = false;
    }
    change = false;
    //loops++;
  }
  //defaulting all ports that do not have a position
  for(var j = 0; j < vertices.length; j++){
    var inputs = vertices[j].get('inputs');
    var outputs = vertices[j].get('outputs');

    for(var h = 0; h < inputs.length; h++){
      if(inputs[h].get('position') === null){
        inputs[h].set('position', new CardinalPortPosition('E', 50));
      }
    }

    for(h = 0; h < outputs.length; h++){
      if(outputs[h].get('position') === null){
        outputs[h].set('position', new CardinalPortPosition('W', 50));
      }
    }
  }
  console.log('\n' + 'Final Positions');
  for (a = 0; a < vertices.length; a++){
    console.log('Vertex values: ' + vertices[a].get('position').x + ' , ' + vertices[a].get('position').y + '\n');
  }
};
module.exports = layOutGraph;
