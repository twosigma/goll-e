var Graph = require('../model/graph');
var Edge = require('../model/edge');
var Vertex = require('../model/vertex');
var Port = require('../model/port');
var CardinalPortPosition = require('../model/cardinalPortPosition');
var PortType = require('../enum/portType');

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
  VERTEX: '>',
  INPUT: '+',
  OUTPUT: '-'
};

var INVALID_ID_CHARS = ObjectUtils.values(SCOPE_SYMBOLS);

/**
 * Creates data model objects from an abstract syntax tree with some validation.
 *
 * @class ModelFactory
 */
var ModelFactory = function() {
  // all built models keyed by global id
  this._vertices = {};
  this._edges = {};
  this._ports = {};
};

ModelFactory.prototype = {
  /**
   * Parse an abstract syntax tree into a Graph model
   * @method buildGraphModel
   * @param  {Object} data - the AST
   * @returns {Graph}
   */
  buildGraphModel: function(data) {
    data.vertices.forEach(function(vertexData) {
      this.parseVertex(vertexData);
    }.bind(this));

    data.edges.forEach(function(edgeData) {
      this.parseEdge(edgeData);
    }.bind(this));

    /* note: we maintain state to validate that ids are unique.
      a simple stateless mapping function would allow duplicate ids
      */

    var vertices = ObjectUtils.values(this._vertices);
    var edges = ObjectUtils.values(this._edges);

    return new Graph({
      vertices: vertices,
      edges: edges
    });
  },

  parseVertex: function(data, parentId) {
    var scopedId = Lang.isNumber(data.id) ? '' + data.id : data.id;
    var globalId = !Lang.isValue(parentId) ? '' + scopedId : parentId + SCOPE_SYMBOLS.NODE  + scopedId;

    var inputs = data.inputs.map(function(portData) {
      return this.parsePort(portData, PortType.INPUT, globalId);
    }.bind(this));

    var outputs = data.outputs.map(function(portData) {
      return this.parsePort(portData, PortType.OUTPUT, globalId);
    }.bind(this));

    var vertex = new Vertex({
      globalId: globalId,
      id: scopedId,
      inputs: inputs,
      outputs: outputs,
      position: {x: data.x, y: data.y}
    });

    setIfNotExist(globalId, vertex, this._vertices);
    return vertex;
  },

  // parse vertices before edges!
  parseEdge: function(data) {
    var id = data.id;

    var source = this._ports[data.source];
    if (!Lang.isValue(source)) {
      console.error('No such source "'+ data.source + '" yet parsed for edge "' + globalId + '"');
      return null;
    }
    var target = this._ports[data.target];
    if (!Lang.isValue(source)) {
      console.error('No such target "'+ data.target + '" yet parsed for edge "' + globalId + '"');
      return null;
    }

    var edge = new Edge({
      globalId: id,
      id: data.id,
      from: source,
      to: target
    });

    setIfNotExist(id, edge, this._edges);
    return edge;
  },

  parsePort: function(data, type, parentId) {
    var scopeSymbol;
    if (type === PortType.INPUT) {
      scopeSymbol = SCOPE_SYMBOLS.INPUT;
    } else if (type === PortType.OUTPUT) {
      scopeSymbol = SCOPE_SYMBOLS.OUTPUT;
    }

    var globalId = parentId + scopeSymbol + data.id;

    var port = new Port({
      id: data.id,
      globalId: globalId,
      type: type,
      position: this.parsePortPosition(data.position)
    });

    setIfNotExist(globalId, port, this._ports);
    return port;
  },

  parsePortPosition: function(data) {
    // assume cardinal for now
    return new CardinalPortPosition({
      direction: data.direction,
      percentage: data.percentage
    });
  }
};

module.exports = ModelFactory;
