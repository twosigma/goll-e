var Quadtree = require('./quadTree');
var QuadNode = require('./quadNode');

var getBoundingBoxForVertex;
// var verticesOverlap;
var vertexToQuadNode;
var quadNodeToVertex;
var quadNodesOverlap;
var boundingBoxesOverlap;

var getCollidingVertices = function(vertices) {
  var quadNodes = vertices.map(vertexToQuadNode);
  var maxArea = quadNodes.reduce(function(prev, quadNode) {
    var bb = quadNode.get('boundingBox');
    return {
      x1: Math.min(prev.x1, bb.x),
      y1: Math.min(prev.y1, bb.y),
      x2: Math.max(prev.x2, bb.x + bb.width),
      y2: Math.max(prev.y2, bb.y + bb.height)
    };
  }, {x1: 0, y1: 0, x2: 0, y2: 0});

  var maxBB = {
    x: maxArea.x1,
    y: maxArea.y1,
    width: maxArea.x2 - maxArea.x1,
    height: maxArea.y2 - maxArea.y1
  };

  var quadTree = new Quadtree({bounds: maxBB});
  quadNodes.forEach(quadTree.insert, quadTree);

  var result = new Map();
  quadNodes.forEach(function(quadNode) {
    var vertex = quadNode.get('value');
    var boundingBox = quadNode.get('boundingBox');

    // function to determine if a quadNode actually overlaps with this one
    var overlaps = quadNodesOverlap.bind(this, quadNode);

    var shortlist = quadTree.retrieve(boundingBox);
    var collidingVerticesSet = new Set(shortlist.filter(overlaps).map(quadNodeToVertex));
    collidingVerticesSet.delete(vertex);
    result.set(vertex, collidingVerticesSet);
  }, this);

  return result;
};

getBoundingBoxForVertex = function(vertex) {
  var position = vertex.get('position');
  var styles = vertex.get('styles');

  return {
    x: position.x,
    y: position.y,
    width: styles.get('width'),
    height: styles.get('height')
  };
};

boundingBoxesOverlap = function(bbA, bbB) {
  return (Math.abs(bbA.x - bbB.x) * 2 < (bbA.width + bbB.width)) &&
    (Math.abs(bbA.y - bbB.y) * 2 < (bbA.height + bbB.height));
};

// verticesOverlap = function(a, b) {
//   var bbA = getBoundingBoxForVertex(a);
//   var bbB = getBoundingBoxForVertex(b);

//   return boundingBoxesOverlap(bbA, bbB);
// };

quadNodesOverlap = function(a, b) {
  // this method might be modified in the future case of non-rectangular vertices
  return boundingBoxesOverlap(a.get('boundingBox'), b.get('boundingBox'));
};

vertexToQuadNode = function(vertex) {
  return new QuadNode({
    value: vertex,
    boundingBox: getBoundingBoxForVertex(vertex)
  });
};

quadNodeToVertex = function(quadNode) {
  return quadNode.get('value');
};

module.exports = getCollidingVertices;
