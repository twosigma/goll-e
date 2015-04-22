/**
 * Unit tests for the Content Model Factory.
 */
var ASTExample = require('./graphs/complex.json');
var ModelFactory = require('../lib/model/content/contentModelFactory');
var Graph = require('../lib/model/content/graph');

var should = require('should');

describe('model factory (from AST to Model)', function() {
  it('should not derp', function() {
    var graph = ModelFactory.buildGraph(ASTExample);
    graph.should.be.instanceOf(Graph);
    graph.get('vertices').length.should.be.greaterThan(0);
  });
});
