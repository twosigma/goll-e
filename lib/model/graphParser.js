var Graph = require('./graph');
var Connection = require('./connection');
var Node = require('./node');
var Port = require('./port');
var CardinalPortPosition = require('./cardinalPortPosition');
var IOType = require('../enum/ioType');
var ObjectUtils = require('../utilities/objects');

var setIfNotExist = function(id, obj, map) {
  if (Object.keys(map).indexOf(id) !== -1) {
    console.error('Duplicate entity id: ' + id);
    return false;
  }
  map[id] = obj;
  return true;
};

var GraphParser = function() {
  this._nodes = {};
  this._edges = {};
  this._ios = {};
};

GraphParser.prototype = {
  /**
   * Parse plain object containing content data into a Graph
   * @method ParseGraph
   * @param  {Object} data
   * @returns {Graph}
   */
  parseGraph: function(data) {
    data.nodes.forEach(function(nodeData) {
      this.parseNode(nodeData);
    }.bind(this));

    data.edges.forEach(function(edgeData) {
      this.parseEdge(edgeData);
    }.bind(this));

    /* note: we maintain state to validate that ids are unique.
      a simple stateless mapping function would allow duplicate ids
      */

    var nodes = ObjectUtils.values(this._nodes);
    var edges = ObjectUtils.values(this._edges);

    return new Graph(nodes, edges);
  },

  parseNode: function(data) {
    var inputs = data.inputs.map(function(ioData) {
      return this.parseIO(ioData, IOType.INPUT);
    }.bind(this));

    var outputs = data.outputs.map(function(ioData) {
      return this.parseIO(ioData, IOType.OUTPUT);
    }.bind(this));
    
    var node = new Node(data.id, inputs, outputs);
    node.setPos(data.x, data.y);

    setIfNotExist(node.getId(), node, this._nodes);
    return node;
  },

  // parse nodes before edges!
  parseEdge: function(data) {
    var source = this._nodes[data.source];
    var target = this._nodes[data.target];
    var id = data.id;

    var edge = new Connection(id, source, target);
    setIfNotExist(id, edge, this._edges);
    return edge;
  },

  parseIO: function(data, type) {
    var io = new Port(data.id, type, this.parseIOPosition(data.position));
    setIfNotExist(io.getId(), io, this._ios);
    return io;
  },

  parseIOPosition: function(data) {
    // assume cardinal for now
    return new CardinalPortPosition(data.direction, data.percentage);
  }
};

module.exports = GraphParser;
