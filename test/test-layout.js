var fs = require('fs');
var path = require('path');
var should = require('should');

var dummyLayoutEngine = require('../lib/layout/dummyLayout');
var springLayoutEngine = require('../lib/layout/forceDirectedLayout');

var gclParser = require('../jison/gcl');
var contentModelFactory = require('../lib/model/content/contentModelFactory');
var LoadedLayout = require('../lib/model/layout/loadedLayout');
var graphsDir = path.join(__dirname, 'graphs');



var getGraph = function(name) {
  var gcl = String(fs.readFileSync(path.join(graphsDir, name + '.gcl')));
  var graph = contentModelFactory.build(gclParser.parse(gcl));
  graph.set('loadedLayout', new LoadedLayout());
  return graph;
};
var testGraph = getGraph('edge');
describe('dummy layout engine', function() {
  it('should not throw when laying out a simple graph', function(done) {
    this.timeout(999999999);

    (function () {
      dummyLayoutEngine(testGraph);
    }).should.not.throw();
    done();
  });
});


describe('spring layout engine', function() {
  it('should not throw when laying out a simple graph', function(done) {
    this.timeout(999999999);
    //var testGraph = getGraph('edge');
    (function () {
      springLayoutEngine(testGraph);
    }).should.not.throw();
    done();
  });
});
