/**
 * Unit tests for the Data Model modules.
 */

var CardinalDirection = require('../../lib/enum/cardinalDirection');

var should = require('should'),
    Port = require('../../lib/model/port.js'),
	Vertex = require('../../lib/model/vertex.js'),
	Edge = require('../../lib/model/edge.js'),
    CardinalPortPosition = require('../../lib/model/cardinalPortPosition.js');

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

	vertex1 = new Vertex({
        id: 1,
        outputs: [port1]
    }),

	vertex2 = new Vertex({
        id: 2,
        inputs: [port2]
    }),

	edge = new Edge({
        id: 1,
        from: port1,
        to: port2
    });

describe('edge', function () {
    it('should have from port which is an "out" type', function (done) {
        edge.get('from').get('type').should.equal("output");
        done();
    });
	it('should have to port which is an "in" type', function (done) {
        edge.get('to').get('type').should.equal("input");
        done();
    });
});

describe('vertex', function () {
	it('should have an in port', function (done) {
        vertex1.get('outputs')[0].should.equal(port1);
        done();
    });
	it('should have an out port', function (done) {
        vertex2.get('inputs')[0].should.equal(port2);
        done();
    });
});
