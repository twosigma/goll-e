var createClass = require('../../utilities/createClass');
var GraphModelBase = require('./graphModelBase');
var AttrValidators = require('../../utilities/attrValidators');

var Vertex = require('./vertex');
var Edge = require('./edge');

var Graph = createClass({
  extend: GraphModelBase,
  constructor: function(config) {
    this._verticesById = {};
    config.vertices.forEach(function(vertex) {
      this._verticesById[vertex.get('globalId')] = vertex;

      vertex.addBubbleTarget(this);
    }.bind(this));

    config.edges.forEach(function(edge) {
      edge.addBubbleTarget(this);
    }, this);
  },

  instance: {
    getVertexById: function(id) {
      return this._verticesById[id] || null;
    }
  },

  attrs: {
    vertices: {
      value: [],
      validator: AttrValidators.isArrayOf(Vertex),
      initOnly: true
    },

    edges: {
      value: [],
      validator: AttrValidators.isArrayOf(Edge),
      initOnly: true
    }
  }
});

module.exports = Graph;
