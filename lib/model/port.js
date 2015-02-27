var Lang = require('./../utilities/lang');
var AttrValidators = require('./../utilities/attrValidators');
var createClass = require('./../utilities/createClass');
var GraphModelBase = require('./graphModelBase');
var PortType = require('./../enum/portType');

var CardinalPortPosition = require('./cardinalPortPosition');

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
  attrs: {
    type: {
      validator: AttrValidators.isValueIn(PortType),
      initOnly: true
    },

    ownerVertexId: {
      validator: Lang.isString
    },

    position: {
      value: null,
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
