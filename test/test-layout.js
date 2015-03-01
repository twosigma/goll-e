var should = require('should');

var Graph = require('./../lib/model/graph');
var Vertex = require('./../lib/model/vertex');
var Port = require('./../lib/model/port');
var CardinalPortPosition = require('./../lib/model/cardinalPortPosition');
var Edge = require('./../lib/model/edge');
var CardinalDirection = require('./../lib/enum/cardinalDirection');

var DummyLayoutEngine = require('./../lib/layout/dummyLayout');
var SpringLayoutEngine = require('./../lib/layout/force-directed-layout');

var generateGraph = function() {
  // the world's simplest graph
  var port = new Port('a+a', 'input', new CardinalPortPosition({percentage: 50, direction: CardinalDirection.NORTH}));
  var vertex = new Vertex('a', [port], []);
  var port2 = new Port('b+b', 'output', new CardinalPortPosition({percentage: 50, direction: CardinalDirection.SOUTH}));
  var vertex2 = new Vertex('b', [], [port2]);
  var edge = new Edge({id:'edge 1', from: port2, to: port});
  //(id, from, to, metadata) 
  var graph = new Graph({vertices: [vertex, vertex2], edges:[edge]});

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


describe('spring layout engine', function() {
  it('should take a graph and not blow up', function(done) {
    var testGraph = generateGraph();
    SpringLayoutEngine(testGraph);
    testGraph.should.be.an.instanceOf(Graph);
    done();
  });
});
