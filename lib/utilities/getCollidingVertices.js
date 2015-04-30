var Quadtree = require('./quadTree');
var QuadNode = require('./quadNode');

var getBoundingBoxForVertex;
var vertexToQuadNode;
var quadNodeToVertex;
var quadNodesOverlap;
var boundingBoxesOverlap;

/**
 * Given a list of vertices, get a map of the others that each collides with.
 * @function getCollidingVertices
 * @param  {Array} vertices array of vertex
 * @param  {Boolean} [sloppy] if true, it may have some false positives, but will run in O(nlogn) as opposed to O(n^2)
 * @return {Map} A Map of Sets. In Java generics notation Map<Vertex, Set<Vertex>>.
 */
var getCollidingVertices = function(vertices, sloppy) {
  var quadNodes = vertices.map(vertexToQuadNode);
  // find a bounding box that encloses all the nodes
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

    var shortlist = quadTree.retrieve(boundingBox);
    var collidingVerticesSet;
    if (sloppy) {
      collidingVerticesSet = new Set(shortlist.map(quadNodeToVertex));
    } else {
      // function to determine if a quadNode actually overlaps with this one
      var overlaps = quadNodesOverlap.bind(this, quadNode);
      collidingVerticesSet = new Set(shortlist.filter(overlaps).map(quadNodeToVertex));
    }

    collidingVerticesSet.delete(vertex); // yes, it collides with itself. Don't care.
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
