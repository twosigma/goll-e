var Lang = require('./../../utilities/lang');
var AttrValidators = require('./../../utilities/attrValidators');
var createClass = require('./../../utilities/createClass');
var GraphModelBase = require('./graphModelBase');
var EdgeLayout = require('./../layout/edgeLayout');

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

  instance: {
    /**
     * Get the start position of an edge in the context of `graph`
     *
     * Returns null if the edge does not start in this graph.
     * (Maybe it starts in a sub- or parent container?)
     *
     * @method getStartPositionIn
     * @param  {Graph} graph the graph to look for the vertex in.
     *                       Result is in its coordinate space.
     * @return {Object|null} object with x and y
     */
    getStartPositionIn: function(graph) {
      var port = this.get('from');

      return port.getPositionInGraph(graph);
    },

    /**
     * Get the end position of an edge in the context of `graph`
     *
     * Returns null if the edge does not start in this graph.
     * (Maybe it starts in a sub- or parent container?)
     *
     * @method getEndPositionIn
     * @param  {Graph} graph the graph to look for the vertex in.
     *                       Result is in its coordinate space.
     * @return {Object|null} object with x and y
     */
    getEndPositionIn: function(graph) {
      var port = this.get('to');

      return port.getPositionInGraph(graph);
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
    },

    layout: {
      validator: AttrValidators.isInstanceOf(EdgeLayout),

      writeOnce: true,

      valueFn: function() {
        var layout = new EdgeLayout();
        layout.addBubbleTarget(this);
        return layout;
      },

      setter: function(val) {
        val.addBubbleTarget(this);
        return val;
      }
    }
  },

  statics: {
    SCOPE_SYMBOL: '>'
  }
});

module.exports = Edge;
