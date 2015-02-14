var should = require('should');

var lib = './../lib/';

var Graph = require(lib + 'model/graph');
var Node = require(lib + 'model/node');
var Port = require(lib + 'model/port');
var CardinalPortPosition = require(lib + 'model/cardinalPortPosition');

var LayoutEngine = require(lib + 'layout/dummyLayoutV2');

var generateGraph = function() {
  // the world's simplest graph
  var port = new Port('a+a', 'input', new CardinalPortPosition(50, 'N'));
  var node = new Node('a', [port], []);
  var graph = new Graph([node], []);
  return graph;
};


describe('layout engine', function() {
  it('should take a graph and not blow up', function(done) {
    var testGraph = generateGraph();
    LayoutEngine(testGraph);
    testGraph.should.be.an.instanceOf(Graph);
  });
});
