/**
 * Unit tests for the Model Factory component of the parser.
 */
var ASTExample = require('./../lib/parse/ASTExample.json');
var ModelFactory = require('./../lib/parse/modelFactory');
var Graph = require('./../lib/model/graph');

var should = require('should');

describe('model factory (from AST to Model)', function () {
    it('should not derp', function () {
        var factory = new ModelFactory();
        var graph = factory.buildGraphModel(ASTExample);
        graph.should.be.instanceOf(Graph);
        graph.get('vertices').length.should.be.greaterThan(0);
    });
});
