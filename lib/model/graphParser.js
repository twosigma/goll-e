var Graph = require('./graph');
var Connection = require('./connection');
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

    return new Graph({
      nodes: nodes,
      connections: edges
    });
  },

  parseNode: function(data, parentId) {
    var scopedId = Lang.isNumber(data.id) ? '' + data.id : data.id;
    var globalId = !Lang.isValue(parentId) ? '' + scopedId : parentId + SCOPE_SYMBOLS.NODE  + scopedId;

    var inputs = data.inputs.map(function(ioData) {
      return this.parseIO(ioData, IOType.INPUT, globalId);
    }.bind(this));

    var outputs = data.outputs.map(function(ioData) {
      return this.parseIO(ioData, IOType.OUTPUT, globalId);
    }.bind(this));
    
    var node = new Node({
      globalId: globalId,
      id: scopedId,
      inputs: inputs,
      outputs: outputs,
      position: {x: data.x, y: data.y}
    });

    setIfNotExist(globalId, node, this._nodes);
    return node;
  },

  // parse nodes before edges!
  parseEdge: function(data) {
    var id = data.id;

    var source = this._ios[data.source];
    if (!Lang.isValue(source)) {
      console.error('No such source "'+ data.source + '" yet parsed for edge "' + globalId + '"');
      return null;
    }
    var target = this._ios[data.target];
    if (!Lang.isValue(source)) {
      console.error('No such target "'+ data.target + '" yet parsed for edge "' + globalId + '"');
      return null;
    }

    var edge = new Connection({
      globalId: id,
      id: data.id,
      from: source,
      to: target
    });

    setIfNotExist(id, edge, this._edges);
    return edge;
  },

  parseIO: function(data, type, parentId) {
    var scopeSymbol;
    if (type === IOType.INPUT) {
      scopeSymbol = SCOPE_SYMBOLS.INPUT;
    } else if (type === IOType.OUTPUT) {
      scopeSymbol = SCOPE_SYMBOLS.OUTPUT;
    }

    var globalId = parentId + scopeSymbol + data.id;

    var io = new Port({
      id: data.id,
      globalId: globalId,
      type: type,
      position: this.parseIOPosition(data.position)
    });

    setIfNotExist(globalId, io, this._ios);
    return io;
  },

  parseIOPosition: function(data) {
    // assume cardinal for now
    return new CardinalPortPosition({
      direction: data.direction,
      percentage: data.percentage
    });
  }
};

module.exports = GraphParser;
