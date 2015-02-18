var Lang = require('./../utilities/lang');
var AttrValidators = require('./../utilities/attrValidators');
var createClass = require('./../utilities/createClass');
var GraphModelBase = require('./graphModelBase');
var IOType = require('./../enum/ioType');

var CardinalPortPosition = require('./cardinalPortPosition');

/**
 * Definition for the Port class. Ports are the points on a Node where
 * connections attach to or from the node. They can be either inputs
 * or outputs.
 * 
 * @class Port
 *
 * @constructor
 * @param {Object} config
 * @param config.id - The Port's unique identifier.
 * @param config.type {IOType} - The type of port. Valid options include "input" or "output".
 * @param config.position {CardinalPortPosition} object describing positioning in the context of the node
 */

var Port = createClass({
  extend: GraphModelBase,
  attrs: {
    type: {
      validator: AttrValidators.isValueIn(IOType),
      initOnly: true
    },

    position: {
      validator: AttrValidators.isInstanceOf(CardinalPortPosition)
    },

    isPinned: {
      value: false,
      validator: Lang.isBoolean
    }
  }
});

// Make the Port object available to other modules.
module.exports = Port;
