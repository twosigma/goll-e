/**
 * Unit tests that attempt to verify that we can generate ASTs from some minimal,
 * valid GOLL-E Content Language files.
 */

var fs = require('fs'),
    path = require('path'),
    should = require('should'),
    _ = require('underscore'),
    generateAST = require('../jison/gcl').parse;

var graphsDir = path.join(__dirname , 'graphs');

var graph = function(name) {
  var gcl = String(fs.readFileSync(path.join(__dirname , 'graphs', name + '.gcl')));
  var ast = require(path.join(__dirname , 'graphs', name + '.json'));
  return {
    gcl: gcl,
    ast: ast
  }
};

var testGenerateAST = function (description, name) {
    'use strict';

    it('should generate an AST from ' + description, function(done) {
      var testingGraph = graph(name);
      var generatedAST = null;

      // Make sure that the file can actually be parsed.
      (function() {
          generatedAST = generateAST(testingGraph.gcl);
      }).should.not.throw();


      // Make sure that it doesn't return null.
      generatedAST.should.not.equal(null);

      // Make sure that it looks like the expected result.
      should(_.isEqual(generatedAST, testingGraph.ast)).be.ok;

      done();
    });
};

describe('gcl parser', function() {

    testGenerateAST('an empty gcl file', 'empty');
    testGenerateAST('a minimal gcl file', 'vertex-minimal');
    testGenerateAST('a gcl file with nested vertices', 'nesting');
    testGenerateAST('a gcl file with metadata on vertices', 'vertex-metadata');
    testGenerateAST('a gcl file with classes on to vertices.', 'vertices-with-classes');
    testGenerateAST('a gcl file with ports', 'port');
    testGenerateAST('a gcl file with classes and metadata on ports', 'ports-with-expressions');
    testGenerateAST('a gcl file with edges', 'edge');
    testGenerateAST('a gcl file with classes and metadata on edges', 'edges-with-classes-and-metadata');
    testGenerateAST('a complex gcl file with nesting, edges, self keyword, classes, and metadata', 'complex');

});
