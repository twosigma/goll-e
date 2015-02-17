var should = require('should');

var lib = './../lib/';

var Graph = require(lib + 'model/graph');
var Node = require(lib + 'model/node');
var Port = require(lib + 'model/port');
var CardinalPortPosition = require(lib + 'model/cardinalPortPosition');

var LayoutEngineV1 = require(lib + 'layout/dummyLayoutV1');
var LayoutEngineV2 = require(lib + 'layout/dummyLayoutV2');

var generateGraph = function() {
  // the world's simplest graph
  var port = new Port('a+a', 'input', new CardinalPortPosition(50, 'N'));
  var node = new Node('a', [port], []);
  var graph = new Graph([node], []);
  return graph;
};



describe('layout engine V2', function() {
  it('should take a graph and not blow up', function(done) {
    var testGraph = generateGraph();
    LayoutEngineV2(testGraph);
    testGraph.should.be.an.instanceOf(Graph);
    done();
  });
});
