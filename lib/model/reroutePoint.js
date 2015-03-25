var createClass = require('../utilities/createClass');
var Lang = require('../utilities/lang');

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
      return {
        x: (targetPos.x + sourcePos.x) / 2 + this.get('x'),
        y: (targetPos.y + sourcePos.y) / 2 + this.get('y')
      };
    },

    updateFromRelative: function(x, y, sourcePos, targetPos) {
      this.setAttrs(ReroutePoint._getAbsoluteFromRelative.apply(this, arguments));
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
     * @method createFromRelative
     * @param  {Object} x
     * @param  {Object} y
     * @param  {Object} sourcePos
     * @param  {Object} targetPos
     * @return {ReroutePoint} the new point
     */
    createFromRelative: function(x, y, sourcePos, targetPos) {
      return new ReroutePoint(ReroutePoint._getAbsoluteFromRelative.apply(this, arguments));
    },

    _getAbsoluteFromRelative: function(x, y, sourcePos, targetPos) {
      return {
        x: x - (targetPos.x + sourcePos.x) / 2,
        y: y - (targetPos.y + sourcePos.y) / 2
      };
    }
  }
});

module.exports = ReroutePoint;
