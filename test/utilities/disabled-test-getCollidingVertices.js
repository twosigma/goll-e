var should = require('should');

var getCollidingVertices = require('../../lib/utilities/getCollidingVertices');
var getCollidingVerticesSlowly = require('./getCollidingVerticesSlowly');
var Vertex = require('../../lib/model/content/vertex');
var VertexStyles = require('../../lib/model/style/vertexStyles');
var VertexLayout = require('../../lib/model/layout/vertexLayout');
var LoadedStyles = require('../../lib/model/style/loadedStyles');
var LoadedLayout = require('../../lib/model/layout/loadedLayout');

var nextId = 0;
// use this style for all tests for simplicity
var style = new VertexStyles({
  width: 200,
  height: 100
});

var loadedStyles = new LoadedStyles();
var loadedLayout = new LoadedLayout();

var createVertex = function(x, y) {
  var id = String(nextId++);
  loadedStyles.put(id, loadedStyles);
  loadedLayout.put(id, new VertexLayout({
    position: {
      x: x,
      y: y
    }
  }));
  return new Vertex({
    id: id,
    globalId: id,

    loadedStyles: loadedStyles,
    loadedLayout: loadedLayout
  });
};

// Compare two Map<Any, Set>s
var compareAnswers = function(actual, expected) {
  actual.size.should.equal(expected.size);
  expected.forEach(function(expectedSet, key) {
    actual.has(key).should.be.true;
    var actualSet = actual.get(key);
    actualSet.size.should.equal(expectedSet.size);
    expectedSet.forEach(function(a) {
      actualSet.has(a).should.be.true;
    });
  });
};

/**
 * Generate a lot of vertices
 * @method generateVertices
 * @param  {Number} canvasSize width and height of square canvas
 * @param  {Number} n how many vertices
 * @return {Array} your vertices
 */
var generateVertices = function(canvasSize, n) {
  var vertices = new Array(n);
  for (var i = 0; i < n; i++) {
    vertices.push(createVertex(Math.floor(Math.random() * canvasSize), Math.floor(Math.random() * canvasSize)));
  }
  return vertices;
};

describe('getCollidingVerticesSlowly', function() {
  // Testing the function to test against.
  it('should work with a simple manual test case', function() {
    var vertices = [
      createVertex(-200, 0), // overlaps with 2
      createVertex(1, 0),
      createVertex(-399, 99), //overlaps with 0
      createVertex(1, 101), // overlaps with 4
      createVertex(1, 100) // overlaps with 3
    ];

    var answerKey = new Map();
    answerKey.set(vertices[0], new Set([vertices[2]]));
    answerKey.set(vertices[1], new Set());
    answerKey.set(vertices[2], new Set([vertices[0]]));
    answerKey.set(vertices[3], new Set([vertices[4]]));
    answerKey.set(vertices[4], new Set([vertices[3]]));

    var funcResult = getCollidingVerticesSlowly(vertices);

    compareAnswers(funcResult, answerKey);

  });
});
describe('getCollidingVertices', function() {
  it('should work with a simple manual test case', function() {
    var vertices = [
      createVertex(-200, 0), // overlaps with 2
      createVertex(1, 0),
      createVertex(-399, 99), //overlaps with 0
      createVertex(1, 101), // overlaps with 4
      createVertex(1, 100) // overlaps with 3
    ];

    var answerKey = new Map();
    answerKey.set(vertices[0], new Set([vertices[2]]));
    answerKey.set(vertices[1], new Set());
    answerKey.set(vertices[2], new Set([vertices[0]]));
    answerKey.set(vertices[3], new Set([vertices[4]]));
    answerKey.set(vertices[4], new Set([vertices[3]]));

    var funcResult = getCollidingVertices(vertices);

    compareAnswers(funcResult, answerKey);
  });

  it('should be idential to the simple algorithm with a large number of random vertices', function(done) {
    this.timeout(5000);
    var vertices = generateVertices(5000, 300);
    // var t = Date.now();
    var fastResult = getCollidingVertices(vertices);
    // tFast = Date.now() - t;
    // t = Date.now();
    var slowResult = getCollidingVerticesSlowly(vertices);
    // var tSlow = Date.now() - t;
    // console.log('' + Math.round((tFast / tSlow) * 100) + '% time of slow algorithm');
    compareAnswers(fastResult, slowResult);
    done();
  });
});
