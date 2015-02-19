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

  instance: {
    /**
     * Get the start position of an edge in the context of `graph`
     *
     * Returns null if the edge does not start in this graph.
     * (Maybe it starts in a sub- or parent container?)
     * 
     * @method getStartPositionIn
     * @param  {Graph} graph the graph to look for the node in. 
     *                       Result is in its coordinate space.
     * @return {Object|null} object with x and y
     */
    getStartPositionIn: function(graph) {
      var port = this.get('from');
      
      return this._getPortPositionIn(port, graph);
    },

    /**
     * Get the end position of an edge in the context of `graph`
     *
     * Returns null if the edge does not start in this graph.
     * (Maybe it starts in a sub- or parent container?)
     * 
     * @method getEndPositionIn
     * @param  {Graph} graph the graph to look for the node in. 
     *                       Result is in its coordinate space.
     * @return {Object|null} object with x and y
     */
    getEndPositionIn: function(graph) {
      var port = this.get('to');
      
      return this._getPortPositionIn(port, graph);
    },

    _getPortPositionIn: function(port, graph) {
      var nodeId = port.get('ownerNodeId');
      var node = graph.getNodeById(nodeId);
      if (node === null) {
        return null;
      }

      return node.getPortPositionInContext(port.get('position'), true);
    }
  },

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

module.exports = Connection;
