var Lang = require('./../../utilities/lang');
var createClass = require('./../../utilities/createClass');
var AttrValidators = require('./../../utilities/attrValidators');
var GraphModelBase = require('./graphModelBase');
var PortType = require('./../../enum/portType');
var VertexStyles = require('../style/vertexStyles');

var Port = require('./port');

var CardinalPortPosition = require('../layout/cardinalPortPosition');
var CardinalDirection = require('../../enum/cardinalDirection');

var validateArrayOfPortsOfType = function(portType) {
  return function(val) {
    if (!Lang.isArray(val)) {
      return false;
    }

    for (var i = 0; i < val.length; i++) {
      if (!(val[i] instanceof Port)) {
        return false;
      }
      if (val[i].get('type') !== portType) {
        return false;
      }
    }

    return true;
  };
};

/**
 * vertex.js
 *
 * Definition for the Vertex class. A Vertex is a composable data structure that
 * contains a collection of Inputs and Outputs, a list of UI styles, and
 * arbitrary key-value metadata. Vertices can also contain other vertices.
 *
 * @class Vertex
 * @constructor
 */
var Vertex = createClass({
  extend: GraphModelBase,

  constructor: function() {
    this._portsById = {};

    // re-fire events from the ports
    this.get('inputs').forEach(function(port) {
      this._portsById[port.get('id')] = port;
      port.addBubbleTarget(this);
    }.bind(this));

    this.get('outputs').forEach(function(port) {
      this._portsById[port.get('id')] = port;
      port.addBubbleTarget(this);
    }.bind(this));
  },

  instance: {
    getPortById: function(id) {
      return this._portsById[id];
    }
  },

  attrs: {
    inputs: {
      value: [],
      validator: validateArrayOfPortsOfType(PortType.INPUT),
      initOnly: true
    },

    outputs: {
      value: [],
      validator: validateArrayOfPortsOfType(PortType.OUTPUT),
      initOnly: true
    },

    defaultPort: {
      valueFn: function() {
        return new Port({
          type: PortType.DEFAULT,
          ownerVertexId: this.get('id'),
          position: new CardinalPortPosition({
            direction: CardinalDirection.NORTH,
            percentage: 0
          })
        });
      },
      readOnly: true
    },

    styles: {
      valueFn: function() {
        return new VertexStyles();
      },

      validator: AttrValidators.isInstanceOf(VertexStyles)
    },

    metadata: {
      validator: Lang.isObject
    },

    position: {
      value: {x: 0, y: 0},
      validator: function(val) {
        return 'x' in val && 'y' in val;
      },

      valueFn: function() {
        return {x: 0, y: 0};
      }
    },

    isPinned: {
      value: false,
      validator: Lang.isBoolean
    },

    subGraph: {
      value: null,
      writeOnce: true
    }
  },

  statics: {
    SCOPE_SYMBOL: '>'
  }
});

module.exports = Vertex;
