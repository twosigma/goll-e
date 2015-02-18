var createClass = require('./../utilities/createClass');
var GraphModelBase = require('./graphModelBase');
var AttrValidators = require('./../utilities/attrValidators');

var Node = require('./node');
var Connection = require('./connection');

var Graph = createClass({
  extend: GraphModelBase,
  constructor: function(config) {
    this._nodesById = {};
    config.nodes.forEach(function(node) {
      this._nodesById[node.get('globalId')] = node;

      node.addBubbleTarget(this);
    }.bind(this));

    config.connections.forEach(function(edge) {
      edge.addBubbleTarget(this);
    });
  },

  instance: {
    getNodeById: function(id) {
      return this._nodesById[id] || null;
    }
  },

  attrs: {
    nodes: {
      value: [],
      validator: AttrValidators.isArrayOf(Node),
      initOnly: true
    },

    connections: {
      value: [],
      validator: AttrValidators.isArrayOf(Connection),
      initOnly: true
    }
  }
});

module.exports = Graph;
