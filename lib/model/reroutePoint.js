var createClass = require('../utilities/createClass');
var Lang = require('../utilities/lang');
var translateCoordinates = require('../utilities/translateCoordinates');

var ORIGIN = {x: 0, y: 0};

/**
 * A set of x, y coordinates for a reroute point.
 * Points are stored as coordinates relative to the position of the ports.
 * That is, the origin is moved to the average point between the ports.
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
      var deltaX = targetPos.x - sourcePos.x;
      var deltaY = targetPos.y - sourcePos.y;
      var angle = Math.atan(deltaY / deltaX);
      if (deltaX < 0) {
        angle += Math.PI;
      }

      var distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));

      var scaleFactor = 1 / distance;

      var offset = {
        x: (sourcePos.x + targetPos.x) / 2,
        y: (sourcePos.y + targetPos.y) / 2
      };

      var p1 = {
        x: this.get('x'),
        y: this.get('y')
      };

      var origin = translateCoordinates(ORIGIN, offset, scaleFactor, angle);

      var p = translateCoordinates(p1, origin, 1 / scaleFactor, -angle);

      return p;
    },

    updateFromAbsolute: function(x, y, sourcePos, targetPos) {
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
    createFromAbsolute: function(x, y, sourcePos, targetPos) {
      return new ReroutePoint(ReroutePoint._getRelativeFromAbsolute.apply(this, arguments));
    },

    _getRelativeFromAbsolute: function(x, y, sourcePos, targetPos) {
      var deltaX = targetPos.x - sourcePos.x;
      var deltaY = targetPos.y - sourcePos.y;
      var angle = Math.atan(deltaY / deltaX);
      if (deltaX < 0) {
        angle += Math.PI;
      }

      var distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));

      var scaleFactor = 1 / distance;

      var offset = {
        x: (sourcePos.x + targetPos.x) / 2,
        y: (sourcePos.y + targetPos.y) / 2
      };

      var p = {x: x, y: y};

      var p1 = translateCoordinates(p, offset, scaleFactor, angle);

      // var x1 = x - offsetX;
      // var y1 = y - offsetY;

      // var x1 = x1 * Math.cos(-angle) - y1 * Math.sin(-angle);
      // var y1 = x1 * Math.sin(-angle) - y1 * Math.cos(-angle);

      // x1 *= scaleFactor;
      // y1 *= scaleFactor;


      console.debug('x1: ' + p1.x + ' y1:' + p1.y);

      return {
        x: p1.x,
        y: p1.y
      };
    }
  }
});

module.exports = ReroutePoint;
