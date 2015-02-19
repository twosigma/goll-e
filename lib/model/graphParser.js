var Graph = require('./graph');
var Connection = require('./connection');
/*global Node:true*/
var Node = require('./node');
var Port = require('./port');
var CardinalPortPosition = require('./cardinalPortPosition');
var IOType = require('../enum/ioType');

var ObjectUtils = require('../utilities/objects');
var Lang = require('../utilities/lang');

var setIfNotExist = function(id, obj, map) {

  if (Object.keys(map).indexOf(id) !== -1) {
    console.error('Duplicate entity id: ' + id);
    return false;
  }

  map[id] = obj;
  return true;
};


var SCOPE_SYMBOLS = {
  NODE: '>',
  INPUT: '+',
  OUTPUT: '-'
};

var INVALID_ID_CHARS = ObjectUtils.values(SCOPE_SYMBOLS);

// Validate scoped id
var validateId = function(id) {

  if (!Lang.isValue(id)) {
    throw 'Id must be defined';
  }

  if (!(Lang.isString(id) || Lang.isNumber(id))) {
    throw 'Id must be a string or number';
  }

  INVALID_ID_CHARS.forEach(function(invalidChar) {
    if (String(id).indexOf(invalidChar) !== -1) {
      throw 'Id cannot contain \'' + invalidChar + '\'';
    }
  });

  return id;
};

/**
 * Creates data model objects from JSON objects with some validation.
 *
 * @class GraphParser
 */
var GraphParser = function() {

  // all built models keyed by global id
  this._nodes = {};
  this._edges = {};
  this._ios = {};
};

GraphParser.prototype = {
  /**
   * Parse plain object containing content data into a Graph
   * @method ParseGraph
   * @param {Object} data - Plain object containing content data.
   * @returns {Graph} - An instantiated graph object.
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

  /**
   * Converts a plain data object representation of a graph node into an actual
   * Vertex object.
   * @param {Object} data - ?
   * @param {Number} parentId - ?
   * @returns {Node} - a graph node
   */
  parseNode: function(data, parentId) {
    validateId(data.id);

    var globalId = !Lang.isValue(parentId) ? data.id : parentId + SCOPE_SYMBOLS.NODE + data.id;

    var inputs = data.inputs.map(function(ioData) {
      return this.parseIO(ioData, IOType.INPUT, globalId);
    }.bind(this));

    var outputs = data.outputs.map(function(ioData) {
      return this.parseIO(ioData, IOType.OUTPUT, globalId);
    }.bind(this));

    var node = new Node(globalId, inputs, outputs);
    node.setPosition(data.x, data.y);

    setIfNotExist(node.getId(), node, this._nodes);
    return node;
  },

  /**
   * Generates an Edge model object from a plain json object. Make sure that this is parsed before the edges!
   * @param {Object} data - ?
   * @returns {Edge} - ?
   */
  parseEdge: function(data) {
    var source = this._nodes[data.source];
    var target = this._nodes[data.target];
    var id = validateId(data.id);

    var edge = new Connection(id, source, target);
    setIfNotExist(id, edge, this._edges);
    return edge;
  },

  /**
   * Generates a Port model object from a plain json object.
   * @param {Object} data - Plain json object.
   * @param {IOType} type - The type of port to generate.
   * @param {Number} parentId - The ID of Vertex that this IO belongs to.
   * @returns {Port} - ?
   */
  parseIO: function(data, type, parentId) {
    validateId(data.id);

    var scopeSymbol;
    if (type === IOType.INPUT) {
      scopeSymbol = SCOPE_SYMBOLS.INPUT;
    } else if (type === IOType.OUTPUT) {
      scopeSymbol = SCOPE_SYMBOLS.OUTPUT;
    }

    var globalId = parentId + scopeSymbol + data.id;

    var io = new Port(globalId, type, this.parseIOPosition(data.position));
    setIfNotExist(io.getId(), io, this._ios);
    return io;
  },

  /**
   * Figures out where the IO should be on its parent node.
   * @param {Object} data - Plain json object.
   * @returns {CardinalPortPosition} - The IO's position.
   */
  parseIOPosition: function(data) {
    // assume cardinal for now
    return new CardinalPortPosition(data.direction, data.percentage);
  }
};

module.exports = GraphParser;
