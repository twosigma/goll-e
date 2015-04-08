var Lang = require('./../../utilities/lang');
var createClass = require('./../../utilities/createClass');
var GraphModelBase = require('./graphModelBase');
var PortType = require('./../../enum/portType');
var VertexStyles = require('../style/vertexStyles');
var VertexLayout = require('../layout/vertexLayout');

var Port = require('./port');

var PortLayout = require('../layout/portLayout');
var loadedLayout = require('../layout/loadedLayout');
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
        var globalId = this.get('globalId') + '.default';
        var position = new CardinalPortPosition({
          direction: CardinalDirection.NORTH,
          percentage: 0
        });

        loadedLayout.put(globalId, new PortLayout({
          position: position
        }));

        return new Port({
          globalId: globalId,
          id: 'default',
          type: PortType.DEFAULT,
          ownerVertexId: this.get('id')
        });
      },
      readOnly: true
    },

    metadata: {
      validator: Lang.isObject
    },

    subGraph: {
      value: null,
      writeOnce: true
    }
  },

  statics: {
    SCOPE_SYMBOL: '>',
    STYLE_CLASS: VertexStyles,
    LAYOUT_CLASS: VertexLayout
  }
});

module.exports = Vertex;
