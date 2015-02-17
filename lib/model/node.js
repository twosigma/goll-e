var Lang = require('./../utilities/lang');
var createClass = require('./../utilities/createClass');
var GraphModelBase = require('./graphModelBase');
var IOType = require('./../enum/ioType');

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

  instance: {
    setPosition: function(x, y) {
      this.set('position', {x: x, y: y});
    }
  },

  attrs: {
    inputs: {
      validator: validateArrayOfPortsOfType(IOType.INPUT)
    },

    outputs: {
      validator: validateArrayOfPortsOfType(IOType.OUTPUT)
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
    }
  }
});

module.exports = Node;
