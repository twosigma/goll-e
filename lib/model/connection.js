var Lang = require('./../utilities/lang');
var AttrValidators = require('./../utilities/attrValidators');
var createClass = require('./../utilities/createClass');
var GraphModelBase = require('./graphModelBase');

var Port = require('./port');

/**
 * Definition for the Connection class. A Connection is the linkage between a
 * Node's Output and another (potentially different) node's Input.
 * 
 * Alternatively, in the situation where a node is contained within another node,
 * the containee can have a connection from one of its Outputs to one of the
 * container's Outputs. The same applies for Inputs.
 * 
 * @class Connection
 * @constructor
 *
 * @param config.id - The Connection's unique identifier.
 * @param config.from - The Output object that is the connection's source.
 * @param config.to - The Input object that is the connection's target.
 * @param config.metadata - A standard JavaScript object containing key-value metadata.
 */
var Connection = createClass({
  extend: GraphModelBase,

  attrs: {
    from: {
      validator: AttrValidators.isInstanceOf(Port),
      writeOnce: true
    },

    to: {
      validator: AttrValidators.isInstanceOf(Port),
      writeOnce: true
    },

    metadata: {
      validator: Lang.isObject
    }
  }
});

module.exports = Connection;
