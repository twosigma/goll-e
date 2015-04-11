// A simple, correct, and slow way to get colliding vertices.
// Used to test against the complex fast way

var getBoundingBoxForVertex = function(vertex) {
  var position = vertex.get('position');
  var styles = vertex.get('styles');

  return {
    x: position.x,
    y: position.y,
    width: styles.get('width'),
    height: styles.get('height')
  };
};

var verticesOverlap = function(a, b) {
  var bbA = getBoundingBoxForVertex(a);
  var bbB = getBoundingBoxForVertex(b);

  return (Math.abs(bbA.x - bbB.x) * 2 < (bbA.width + bbB.width)) &&
    (Math.abs(bbA.y - bbB.y) * 2 < (bbA.height + bbB.height));
};

var getCollidingVerticesSlowly = function(vertices) {
  var result = new Map();
  vertices.forEach(function(vertex) {
    var matchSet = new Set(vertices.filter(verticesOverlap.bind(null, vertex)));
    matchSet.delete(vertex);
    result.set(vertex, matchSet);
  });
  return result;
};

module.exports = getCollidingVerticesSlowly;