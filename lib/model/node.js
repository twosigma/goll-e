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

  constructor: function(config) {

    // re-fire events from the ports
    this.get('inputs').forEach(function(port) {
      port.after('change', function(e) {
        this.fire('change', null, {originalEvent: e});
      }, this);
    }.bind(this));

    this.get('outputs').forEach(function(port) {
      port.after('change', function(e) {
        this.fire('change', null, {originalEvent: e});
      }, this);
    }.bind(this));
  },

  instance: {
    setPosition: function(x, y) {
      this.set('position', {x: x, y: y});
    }
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
