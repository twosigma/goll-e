/**
 * Unit tests for the Data Model modules.
 */

var CardinalDirection = require('../../lib/enum/cardinalDirection');

var should = require('should'),
    Port = require('../../lib/model/port.js'),
	Vertex = require('../../lib/model/vertex.js'),
	Edge = require('../../lib/model/edge.js'),
    CardinalPortPosition = require('../../lib/model/cardinalPortPosition.js')
	port1 = new Port(1,"out",new CardinalPortPosition(CardinalDirection.WEST, 50)),
	port2 = new Port(2,"in", new CardinalPortPosition(CardinalDirection.SOUTH,60)),
	vertex1 = new Vertex(1,[port1],[],"some style","some meta data"),
	vertex2 = new Vertex(2,[],[port2],"some style","some meta data"),
	edge = new Edge(1,port1,port2,"some meta data");

describe('edge', function () {
    it('should have from port which is an "out" type', function (done) {
        edge.getFrom().getType().should.equal("out");
        done();
    });
	it('should have to port which is an "in" type', function (done) {
        edge.getTo().getType().should.equal("in");
        done();
    });
});

describe('vertex', function () {
    it('should contain some style', function (done) {
        vertex1.getStyles().should.equal("some style");
        done();
    });
	it('should have an in port', function (done) {
        vertex1.getInputs()[0].should.equal(port1);
        done();
    });
	it('should have an out port', function (done) {
        vertex2.getOutputs()[0].should.equal(port2);
        done();
    });
});
