/**
 * Unit tests for the Layout Model Factory component of the gll parser.
 */
var ASTExample = require('./gllAST.json');
var LayoutModelFactory = require('../lib/model/layout/layoutModelFactory');
var loadedLayout = require('../lib/model/layout/loadedLayout');
var CardinalDirection = require('../lib/enum/cardinalDirection');

var should = require('should');

describe('model factory (from AST to Model)', function () {
  it('should work', function () {
    LayoutModelFactory.loadModels(ASTExample);
    var vertexLayout = loadedLayout.fetch('Alpha');
    vertexLayout.get('position').x.should.equal(30);

    var portLayout = loadedLayout.fetch('Alpha.Bill');
    portLayout.get('position').get('direction').should.equal(CardinalDirection.NORTH);
    portLayout.get('position').get('percentage').should.equal(30);
  });
});
