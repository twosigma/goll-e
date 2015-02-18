/**
 * Unit tests for the Data Model modules.
 */
var TEST_DATA = require('./../lib/test-data.json');
var GraphParser = require('./../lib/model/graphParser');
var Graph = require('./../lib/model/graph');

var should = require('should');

describe('graph parser (from a JSON file)', function () {
    it('should not derp', function () {
        var parser = new GraphParser();
        var graph = parser.parseGraph(TEST_DATA);
        graph.should.be.instanceOf(Graph);
        graph.get('nodes').length.should.be.greaterThan(0);
    });
});