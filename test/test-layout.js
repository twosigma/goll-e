var fs = require('fs');
var path = require('path');
var should = require('should');

var dummyLayoutEngine = require('../lib/layout/dummyLayout');
var springLayoutEngine = require('../lib/layout/forceDirectedLayout');

var parse = require('../lib/parse/parse.js');
var graphsDir = path.join(__dirname , 'graphs');


var getGraph = function(name) {
  var gcl = String(fs.readFileSync(path.join(graphsDir, name + '.gcl')));
  var graph = parse(gcl).model;
  return graph;
};

describe('dummy layout engine', function() {
  it('should not throw when laying out a simple graph', function(done) {
    var testGraph = getGraph('edge');
    (function () {
      dummyLayoutEngine(testGraph);
    }).should.not.throw();
    done();
  });
});


describe('spring layout engine', function() {
  it('should not throw when laying out a simple graph', function(done) {
    var testGraph = getGraph('edge');
    (function () {
      springLayoutEngine(testGraph);
    }).should.not.throw();
    done();
  });
});
