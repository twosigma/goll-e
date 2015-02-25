var Lang = require('./../utilities/lang');
var createClass = require('./../utilities/createClass');
var ObjectUtils = require('./../utilities/objects');
var GraphModelBase = require('./graphModelBase');
var IOType = require('./../enum/ioType');
var PositionUtils = require('../utilities/positionUtils.js');

var Port = require('./port');

var validateArrayOfPortsOfType = function(ioType) {
  return function(val) {
    if (!Lang.isArray(val)) {
      return false;
    }

    for (var i = 0; i < val.length; i++) {
      if (!(val[i] instanceof Port)) {
        return false;
      }
      if (val[i].get('type') !== ioType) {
        return false;
      }
    }

    return true;
  };
};

/**
 * node.js
 *
 * Definition for the Node class. A Node is a composable data structure that
 * contains a collection of Inputs and Outputs, a list of UI styles, and
 * arbitrary key-value metadata. Nodes can also contain other nodes.
 *
 * @class Node
 * @constructor
 */
var Node = createClass({
  extend: GraphModelBase,

  constructor: function() {

    // re-fire events from the ports
    this.get('inputs').forEach(function(port) {
      port.addBubbleTarget(this);
    }.bind(this));

    this.get('outputs').forEach(function(port) {
      port.addBubbleTarget(this);
    }.bind(this));
  },

  instance: {
    setPosition: function(x, y) {
      this.set('position', {x: x, y: y});
    },

    /**
     * Get cartesian coordinates of a port as if it were in this node.
     * @method getPortPositionInContext
     * @param  {CardinalPortPosition} portPosition
     * @param  {Boolean} [useGraphSpace] If true, coordinates are in the container's coordinate space instead of the node's
     * @return {Object} With properties x, y, angle (radians)
     */
    getPortPositionInContext: function(portPosition, useGraphSpace) {
      var cartesianPos = PositionUtils.Conversion.cardinalToCartesian(portPosition);
      var styles = this.get('styles');

      var result = {
        x: cartesianPos.getX() * styles.width,
        y: cartesianPos.getY() * styles.height,
        angle: portPosition.getAngle()
      };

      if (useGraphSpace) {
        var myPos = this.get('position');
        result.x += myPos.x;
        result.y += myPos.y;
      }

      return result;
    }
  },

  statics: {
    /**
     * @static
     * @property {Object} DEFAULT_STYLES Default values for all styles that must be defined
     */
    DEFAULT_STYLES: Object.freeze({
      width: 150,
      height: 94
    })
  },

  attrs: {
    inputs: {
      value: [],
      validator: validateArrayOfPortsOfType(IOType.INPUT),
      initOnly: true
    },

    outputs: {
      value: [],
      validator: validateArrayOfPortsOfType(IOType.OUTPUT),
      initOnly: true
    },

    /**
     * Key/value pairs of styles
     * Guaranteed to have default styles set
     * (which come from the static DEFAULT_STYLES on Node)
     * @attribute styles
     * @type      Object
     */
    styles: {
      validator: Lang.isObject,
      valueFn: function() {
        return Node.DEFAULT_STYLES;
      },
      
      setter: function(val) {
        // merge set styles w/ defaults
        // so that it's guaranteed to have defaults set
        return ObjectUtils.merge(Node.DEFAULT_STYLES, val);
      }
    },

    metadata: {
      validator: Lang.isObject
    },

    position: {
      validator: function(val) {
        return 'x' in val && 'y' in val;
      }
    }
  }
});

module.exports = Node;
