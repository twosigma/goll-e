var should = require('should');

var Graph = require('./../lib/model/graph');
var Node = require('./../lib/model/node');
var Port = require('./../lib/model/port');
var CardinalPortPosition = require('./../lib/model/cardinalPortPosition');
var Connection = require('./../lib/model/connection');
var CardinalDirection = require('./../lib/enum/cardinalDirection');


var DummyLayoutEngine = require('./../lib/layout/dummyLayout');

var generateGraph = function() {
  // the world's simplest graph
  var port = new Port('a+a', 'input', new CardinalPortPosition({percentage: 50, direction: CardinalDirection.NORTH}));
  var node = new Node('a', [port], []);
  var port2 = new Port('b+b', 'output', new CardinalPortPosition({percentage: 50, direction: CardinalDirection.SOUTH}));
  var node2 = new Node('b', [], [port2]);
  var conn = new Connection({id:'connection 1', from: port2, to: port});
  //(id, from, to, metadata) 
  var graph = new Graph({nodes: [node, node2], connections:[conn]});
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
