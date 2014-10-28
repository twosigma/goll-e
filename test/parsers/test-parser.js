/**
 * Unit tests that attempt to verify that we can at the very least parse some
 * valid gcl files.
 */

var fs = require('fs'),
    path = require('path'),
    should = require('should'),
    parser = require('../../lib/parsers/gcl.js');

var testParse = function (gclPath, done) {
    'use strict';
    
    // Attempt to read in the specified sample file.
    fs.readFile(gclPath, { 
        encoding: 'utf-8', 
        flag: 'r'
    }, function (err, data) {
        // Throw an error if the file can't be rest.
        if(err) throw err;

        // Make sure that the file can actually be parsed.
        (function() {
            parser.parse(data);
        }).should.not.throw();

        // If it doesn't throw, we're good.
        done();
    });
}

describe('gcl parser', function() {
    it('should parse an empty gcl file', function(done) {
        var filePath = path.join(__dirname, 'graphs', 'empty.gcl');
        testParse(filePath, done);
    });

    it('should parse a minimal gcl file', function(done) {
        var filePath = path.join(__dirname, 'graphs', 'node-minimal.gcl');
        testParse(filePath, done);
    });

    it('should parse a gcl file with nested nodes', function(done) {
        var filePath = path.join(__dirname, 'graphs', 'node-nesting.gcl');
        testParse(filePath, done);
    });

    it('should parse a gcl file with attributes present', function(done) {
        var filePath = path.join(__dirname, 'graphs', 'node-metadata.gcl');
        testParse(filePath, done);
    });

    it('should parse a gcl file with styles on nodes.', function(done) {
        var filePath = path.join(__dirname, 'graphs', 'node-style.gcl');
        testParse(filePath, done);
    });

    it('should parse a gcl file with inputs and outputs', function(done) {
        var filePath = path.join(__dirname, 'graphs', 'node-inputs-outputs.gcl');
        testParse(filePath, done);
    });

    it('should parse a gcl file with styles and attributes on inputs and outputs', function(done) {
        var filePath = path.join(__dirname, 'graphs', 'node-inputs-outputs-with-expressions.gcl');
        testParse(filePath, done);
    });

    it('should parse a gcl file with connected nodes present', function(done) {
        var filePath = path.join(__dirname, 'graphs', 'node-connections.gcl');
        testParse(filePath, done);
    });

    it('should parse a gcl file with styles and attributes on node connections', function(done) {
        var filePath = path.join(__dirname, 'graphs', 'node-connections-with-expressions.gcl');
        testParse(filePath, done);
    });

});
