var should = require('should');

var Graph = require('./../lib/model/graph');
var Vertex = require('./../lib/model/vertex');
var Port = require('./../lib/model/port');
var CardinalPortPosition = require('./../lib/model/cardinalPortPosition');
var Edge = require('./../lib/model/edge');

var DummyLayoutEngine = require('./../lib/layout/dummyLayout');

var generateGraph = function() {
  // the world's simplest graph
  var port = new Port('a+a', 'input', new CardinalPortPosition(50, 'N'));
  var vertex = new Vertex('a', [port], []);
  var port2 = new Port('b+b', 'output', new CardinalPortPosition(50, 'S'));
  var vertex2 = new Vertex('b', [], [port2]);
  var edge = new Edge('edge 1', port2, port, 'junk meta data');
  //(id, from, to, metadata) 
  var graph = new Graph([vertex, vertex2], [edge]);
  return graph;
};

describe('dummy layout engine', function() {
  it('should take a graph and not blow up', function(done) {
    var testGraph = generateGraph();
    DummyLayoutEngine(testGraph);
    testGraph.should.be.an.instanceOf(Graph);
    done();
  });
});
