var Lang = require('./../utilities/lang');
var AttrValidators = require('./../utilities/attrValidators');
var createClass = require('./../utilities/createClass');
var GraphModelBase = require('./graphModelBase');

var Port = require('./port');

/**
 * Definition for the Edge class. A Edge is the linkage between a
 * Vertices' Output and another (potentially different) vertex's Input.
 * 
 * Alternatively, in the situation where a vertex is contained within another vertex,
 * the containee can have an edge from one of its Outputs to one of the
 * container's Outputs. The same applies for Inputs.
 * 
 * @class Edge
 * @constructor
 *
 * @param config.id - The Edge's unique identifier.
 * @param config.from - The Output object that is the connection's source.
 * @param config.to - The Input object that is the connection's target.
 * @param config.metadata - A standard JavaScript object containing key-value metadata.
 */
var Edge = createClass({
  extend: GraphModelBase,

  attrs: {
    from: {
      validator: AttrValidators.isInstanceOf(Port),
      initOnly: true
    },

    to: {
      validator: AttrValidators.isInstanceOf(Port),
      initOnly: true
    },

    metadata: {
      validator: Lang.isObject
    }
  }
});

module.exports = Edge;
