var Lang = require('./../utilities/lang');
var AttrValidators = require('./../utilities/attrValidators');
var createClass = require('./../utilities/createClass');
var GraphModelBase = require('./graphModelBase');
var PortType = require('./../enum/portType');
var PositionUtils = require('../utilities/positionUtils.js');

var CardinalPortPosition = require('./cardinalPortPosition');
var CardinalDirection = require('./../enum/cardinalDirection');

/**
 * Definition for the Port class. Ports are the points on a Vertex where
 * connections attach to or from the node. They can be either inputs
 * or outputs.
 *
 * @class Port
 *
 * @constructor
 */

var Port = createClass({
  extend: GraphModelBase,

  instance: {

    /**
     * Get cartesian coordinates of this port relative to the graph.
     *
     * Returns null if the vertex owner (ownerVertexId) is not in this graph.
     * (Maybe it's in in a sub- or parent container?)
     *
     * @method getPortPositionInContext
     * @param  {CardinalPortPosition} portPosition
     * @return {Object} With properties x, y, angle (radians)
     */
    getPositionInGraph: function(graph) {
      var portPosition = this.get('position');
      var cartesianPos = PositionUtils.Conversion.cardinalToCartesian(portPosition);

      var vertexId = this.get('ownerVertexId');
      var vertex = graph.getVertexById(vertexId);
      if (vertex === null) {
        return null;
      }

      var vertexStyles = vertex.get('styles');
      var vPos = vertex.get('position');

      var result = {
        x: cartesianPos.getX() * vertexStyles.get('width') + vPos.x,
        y: cartesianPos.getY() * vertexStyles.get('height') + vPos.y,
        angle: portPosition.getAngle()
      };

      return result;
    }
  },

  attrs: {
    type: {
      validator: AttrValidators.isValueIn(PortType),
      initOnly: true
    },

    ownerVertexId: {
      validator: Lang.isString
    },

    position: {
      value: new CardinalPortPosition({
        direction: CardinalDirection.NORTH,
        percentage: 0
      }),
      validator: AttrValidators.isNullOrInstanceOf(CardinalPortPosition)
    },

    isPinned: {
      value: false,
      validator: Lang.isBoolean
    },

    metadata: {
      value: {},
      validator: Lang.isObject
    }
  },

  statics: {
    SCOPE_SYMBOL_INPUT: '+',
    SCOPE_SYMBOL_OUTPUT: '-'
  }
});

module.exports = Port;
