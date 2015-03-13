var fs = require('fs');
var path = require('path');
var should = require('should');

var dummyLayoutEngine = require('./../lib/layout/dummyLayout');
var springLayoutEngine = require('./../lib/layout/forceDirectedLayout');

var parse = require('./../lib/parse/parse.js');
var graphsDir = path.join(__dirname , 'graphs');


var getGraph = function(name) {
  var gcl = String(fs.readFileSync(path.join(graphsDir, name + '.gcl')));
  var graph = parse(gcl);
  return graph;
};

describe('dummy layout engine', function() {
  it('should take a graph and not blow up', function(done) {
    var testGraph = getGraph('edge');
    dummyLayoutEngine(testGraph);
    testGraph.should.be.an.instanceOf(Graph);
    done();
  });
});


describe('spring layout engine', function() {
  it('should take a graph and not blow up', function(done) {
    var testGraph = getGraph('getGraph');
    springLayoutEngine(testGraph);
    testGraph.should.be.an.instanceOf(Graph);
    done();
  });
});
