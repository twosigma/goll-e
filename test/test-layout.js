var should = require('should');

var Graph = require('./../lib/model/graph');
var Node = require('./../lib/model/node');
var Port = require('./../lib/model/port');
var CardinalPortPosition = require('./../lib/model/cardinalPortPosition');
var Connection = require('./../lib/model/connection');

var DummyLayoutEngine = require('./../lib/layout/dummyLayout');

var generateGraph = function() {
  // the world's simplest graph
  var port = new Port('a+a', 'input', new CardinalPortPosition(50, 'N'));
  var node = new Node('a', [port], []);
  var port2 = new Port('b+b', 'output', new CardinalPortPosition(50, 'S'));
  var node2 = new Node('b', [], [port2]);
  var conn = new Connection('connection 1', port2, port, 'junk meta data');
  //(id, from, to, metadata) 
  var graph = new Graph([node, node2], [conn]);
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
