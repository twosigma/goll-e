var should = require('should');

var PositionUtils = require('../../lib/utilities/positionUtils');
var CardinalPortPosition = require('../../lib/model/layout/cardinalPortPosition');
var CardinalDirection = require('../../lib/enum/cardinalDirection');

describe('PositionUtils', function() {
  describe('Conversion.cardinalToCartesian', function() {
    it('should convert cadinal points to cartesian ones on a 1x1 container', function() {
      var convert = PositionUtils.Conversion.cardinalToCartesian;

      var cardinal;
      var cartesian;

      cardinal = new CardinalPortPosition({
        percentage: 25,
        direction: CardinalDirection.NORTH
      });
      cartesian = convert(cardinal);
      cartesian.x.should.be.approximately(0.25, 0.01);
      cartesian.y.should.be.exactly(0);

      cardinal = new CardinalPortPosition({
        percentage: 52,
        direction: CardinalDirection.SOUTH
      });
      cartesian = convert(cardinal);
      cartesian.x.should.be.approximately(0.52, 0.01);
      cartesian.y.should.be.exactly(1);

      cardinal = new CardinalPortPosition({
        percentage: 78,
        direction: CardinalDirection.EAST
      });
      cartesian = convert(cardinal);
      cartesian.y.should.be.approximately(0.78, 0.01);
      cartesian.x.should.be.exactly(1);

      cardinal = new CardinalPortPosition({
        percentage: 2,
        direction: CardinalDirection.WEST
      });
      cartesian = convert(cardinal);
      cartesian.y.should.be.approximately(0.02, 0.01);
      cartesian.x.should.be.exactly(0);

      cardinal = new CardinalPortPosition({
        percentage: 100,
        direction: CardinalDirection.EAST
      });
      cartesian = convert(cardinal);
      cartesian.y.should.be.approximately(1, 0.01);
      cartesian.x.should.be.exactly(1);

    });
  });
  describe('Conversion.cartesianToCardinal', function() {
    it('should find the nearest cardinal position from a cartesian coordinate on a 1x1 container', function() {
      var convert = PositionUtils.Conversion.cartesianToCardinal;

      var cartesian;
      var cardinal;

      cartesian = {x: 0, y: 0.25};
      cardinal = convert(cartesian);

      cardinal.get('direction').should.equal(CardinalDirection.WEST);
      cardinal.get('percentage').should.equal(25);

      cartesian = {x: 0.49, y: 0.50};
      cardinal = convert(cartesian);

      cardinal.get('direction').should.equal(CardinalDirection.WEST);
      cardinal.get('percentage').should.equal(50);

      cartesian = {x: 0.49, y: -100};
      cardinal = convert(cartesian);

      cardinal.get('direction').should.equal(CardinalDirection.NORTH);
      cardinal.get('percentage').should.equal(49);

      cartesian = {x: 0.8, y: 0.801};
      cardinal = convert(cartesian);

      cardinal.get('direction').should.equal(CardinalDirection.SOUTH);
      cardinal.get('percentage').should.equal(80);


    });
  });
});