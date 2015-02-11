/**
 * Unit tests for the Hello module.
 */

var should = require('should'),
    hello = require('../lib/hello.js');

describe('hello', function () {
    it('should print \"Hello World\"', function (done) {
        hello().should.equal( "Hello World" );
        done();
    });
});
