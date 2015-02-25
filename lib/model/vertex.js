var Lang = require('./../utilities/lang');
var createClass = require('./../utilities/createClass');
var GraphModelBase = require('./graphModelBase');
var PortType = require('./../enum/portType');

var Port = require('./port');

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

  constructor: function(config) {

    // re-fire events from the ports
    this.get('inputs').forEach(function(port) {
      port.addBubbleTarget(this);
    }.bind(this));

    this.get('outputs').forEach(function(port) {
      port.addBubbleTarget(this);
    }.bind(this));
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

    styles: {
      //dunno
    },

    metadata: {
      validator: Lang.isObject
    },

    position: {
      validator: function(val) {
        return 'x' in val && 'y' in val;
      }
    },

    isPinned: {
      value: false,
      validator: Lang.isBoolean
    }
  }
});

module.exports = Vertex;
