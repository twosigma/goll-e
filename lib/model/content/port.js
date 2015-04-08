var Lang = require('./../../utilities/lang');
var AttrValidators = require('./../../utilities/attrValidators');
var createClass = require('./../../utilities/createClass');
var GraphModelBase = require('./graphModelBase');
var PortType = require('./../../enum/portType');
var PositionUtils = require('../../utilities/positionUtils.js');
var PortLayout = require('../layout/portLayout');


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
     * @method getPositionInGraph
     * @param  {CardinalPortPosition} graph container
     * @return {Object} With properties x, y, angle (radians)
     */
    getPositionInGraph: function(graph) {
      var portPosition = this.getLayout().get('position');
      var cartesianPos = PositionUtils.Conversion.cardinalToCartesian(portPosition);

      var vertexId = this.get('ownerVertexId');
      var vertex = graph.getVertexById(vertexId);
      if (vertex === null) {
        return null;
      }

      var vertexStyles = vertex.getStyles();
      var vPos = vertex.getLayout().get('position');

      var result = {
        x: cartesianPos.x * vertexStyles.get('width') + vPos.x,
        y: cartesianPos.y * vertexStyles.get('height') + vPos.y,
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

    metadata: {
      value: {},
      validator: Lang.isObject
    }
  },

  statics: {
    SCOPE_SYMBOL_INPUT: '+',
    SCOPE_SYMBOL_OUTPUT: '-',
    LAYOUT_CLASS: PortLayout
  }
});

module.exports = Port;
