var createClass = require('../utilities/createClass');
var Lang = require('../utilities/lang');
var translateCoordinates = require('../utilities/translateCoordinates');

var ORIGIN = {x: 0, y: 0};

var getCommonTransformData = function(sourcePos, targetPos) {
  var result = {};

  var deltaX = targetPos.x - sourcePos.x;
  var deltaY = targetPos.y - sourcePos.y;
  result.angle = Math.atan(deltaY / deltaX);
  if (deltaX < 0) {
    result.angle += Math.PI;
  }

  result.distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));

  result.scaleFactor = 1 / result.distance;

  result.offset = {
    x: (sourcePos.x + targetPos.x) / 2,
    y: (sourcePos.y + targetPos.y) / 2
  };

  return result;
};

/**
 * # A set of x, y coordinates for a reroute point.
 * Points are stored as coordinates relative to the position of the ports.
 * That is to get the actual coordinates of a reroute point or prepare a point for storage one must provide the position of the ports.
 *
 * ### Details:
 * Reroute points are specified in a cartesian plane.
 * The "x" axis (we can call it the main axis) runs from the output port to the input port.
 * This distance is one unit.
 * The cross ("y") axis runs perpendicular to it using the same unit scale.
 * The origin is the midpoint between ports.
 *
 * @class ReroutePoint
 */
var ReroutePoint = createClass({
  instance: {
    /**
     * Get the absolute position of this reroute point based on the positions of the ports.
     *
     * @method getAbsolute
     * @param  {Object} sourcePos
     * @param  {Object} targetPos
     * @return {Object} plain object with x, y
     */
    getAbsolute: function(sourcePos, targetPos) {
      var tData = getCommonTransformData(sourcePos, targetPos);

      var p1 = {
        x: this.get('x'),
        y: this.get('y')
      };

      var origin = translateCoordinates(ORIGIN, tData.offset, tData.scaleFactor, tData.angle);

      var p = translateCoordinates(p1, origin, 1 / tData.scaleFactor, -tData.angle);

      return p;
    },

    updateFromAbsolute: function() {
      this.setAttrs(ReroutePoint._getRelativeFromAbsolute.apply(this, arguments));
    }
  },

  attrs: {
    x: {
      validator: Lang.isNumber,
      value: 0
    },

    y: {
      validator: Lang.isNumber,
      value: 0
    }
  },

  statics: {

    /**
     * Create a new ReroutePoint (which stores a position relative to the input and output ports)
     * from their absolute positions.
     *
     * All parameters are objects with x, y.
     * @method createFromAbsolute
     * @param  {Object} x
     * @param  {Object} y
     * @param  {Object} sourcePos
     * @param  {Object} targetPos
     * @return {ReroutePoint} the new point
     */
    createFromAbsolute: function() {
      return new ReroutePoint(ReroutePoint._getRelativeFromAbsolute.apply(this, arguments));
    },

    _getRelativeFromAbsolute: function(x, y, sourcePos, targetPos) {
      var tData = getCommonTransformData(sourcePos, targetPos);

      var p = {x: x, y: y};

      return translateCoordinates(p, tData.offset, tData.scaleFactor, tData.angle);
    }
  }
});

module.exports = ReroutePoint;
