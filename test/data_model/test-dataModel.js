/**
 * Unit tests for the Data Model modules.
 */

var should = require('should'),
    Port = require('../../lib/model/port.js'),
	Node = require('../../lib/model/node.js'),
	Connection = require('../../lib/model/connection.js'),
    CardinalPortPosition = require('../../lib/model/cardinalPortPosition.js')
	port1 = new Port(1,"out",new CardinalPortPosition("N", 50)),
	port2 = new Port(2,"in", new CardinalPortPosition("S",60)),
	node1 = new Node(1,[port1],[],"some style","some meta data"),
	node2 = new Node(2,[],[port2],"some style","some meta data"),
	connection = new Connection(1,port1,port2,"some meta data");

describe('connection', function () {
    it('should have from port which is an "out" type', function (done) {
        connection.getFrom().getType().should.equal("out");
        done();
    });
	it('should have to port which is an "in" type', function (done) {
        connection.getTo().getType().should.equal("in");
        done();
    });
});

describe('node', function () {
    it('should contain some style', function (done) {
        node1.getStyles().should.equal("some style");
        done();
    });
	it('should have an in port', function (done) {
        node1.getIns()[0].should.equal(port1);
        done();
    });
	it('should have an out port', function (done) {
        node2.getOuts()[0].should.equal(port2);
        done();
    });
});