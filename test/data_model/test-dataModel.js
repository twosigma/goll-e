/**
 * Unit tests for the Data Model modules.
 */

var CardinalDirection = require('../../lib/enum/cardinalDirection');

var should = require('should'),
    Port = require('../../lib/model/port.js'),
	Node = require('../../lib/model/node.js'),
	Connection = require('../../lib/model/connection.js'),
    CardinalPortPosition = require('../../lib/model/cardinalPortPosition.js')

    port1 = new Port({
        id: 2,
        type: "output",
        position: new CardinalPortPosition({
            direction: CardinalDirection.WEST,
            percentage: 60
        })
    }),

	port2 = new Port({
        id: 2,
        type: "input",
        position: new CardinalPortPosition({
            direction: CardinalDirection.SOUTH,
            percentage: 60
        })
    }),

	node1 = new Node({
        id: 1,
        outputs: [port1],
        styles: "some style"
    }),

	node2 = new Node({
        id: 2,
        inputs: [port2],
        styles: "some style",
    }),

	connection = new Connection({
        id: 1,
        from: port1,
        to: port2
    });

describe('connection', function () {
    it('should have from port which is an "out" type', function (done) {
        connection.get('from').get('type').should.equal("output");
        done();
    });
	it('should have to port which is an "in" type', function (done) {
        connection.get('to').get('type').should.equal("input");
        done();
    });
});

describe('node', function () {
    it('should contain some style', function (done) {
        node1.get('styles').should.equal("some style");
        done();
    });
	it('should have an in port', function (done) {
        node1.get('outputs')[0].should.equal(port1);
        done();
    });
	it('should have an out port', function (done) {
        node2.get('inputs')[0].should.equal(port2);
        done();
    });
});