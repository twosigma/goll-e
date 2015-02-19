var Graph = require('./graph');
var Edge = require('./edge');
var Vertex = require('./vertex');
var Port = require('./port');
var CardinalPortPosition = require('./cardinalPortPosition');
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
      throw 'Id cannot contain "' + invalidChar + '"';
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
  this._vertices = {};
  this._edges = {};
  this._ports = {};
};

GraphParser.prototype = {
  /**
   * Parse plain object containing content data into a Graph
   * @method ParseGraph
   * @param  {Object} data
   * @returns {Graph}
   */
  parseGraph: function(data) {
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

    return new Graph(vertices, edges);
  },

  parseVertex: function(data, parentId) {
    validateId(data.id);

    var globalId = !Lang.isValue(parentId) ? data.id : parentId + SCOPE_SYMBOLS.VERTEX  + data.id;

    var inputs = data.inputs.map(function(portData) {
      return this.parsePort(portData, PortType.INPUT, globalId);
    }.bind(this));

    var outputs = data.outputs.map(function(portData) {
      return this.parsePort(portData, PortType.OUTPUT, globalId);
    }.bind(this));
    
    var vertex = new Vertex(globalId, inputs, outputs);
    vertex.setPosition(data.x, data.y);

    setIfNotExist(vertex.getId(), vertex, this._vertices);
    return vertex;
  },

  // parse vertices before edges!
  parseEdge: function(data) {
    var source = this._vertices[data.source];
    var target = this._vertices[data.target];
    var id = validateId(data.id);

    var edge = new Edge(id, source, target);
    setIfNotExist(id, edge, this._edges);
    return edge;
  },

  parsePort: function(data, type, parentId) {
    validateId(data.id);

    var scopeSymbol;
    if (type === PortType.INPUT) {
      scopeSymbol = SCOPE_SYMBOLS.INPUT;
    } else if (type === PortType.OUTPUT) {
      scopeSymbol = SCOPE_SYMBOLS.OUTPUT;
    }

    var globalId = parentId + scopeSymbol + data.id;

    var port = new Port(globalId, type, this.parsePortPosition(data.position));
    setIfNotExist(port.getId(), port, this._ports);
    return port;
  },

  parsePortPosition: function(data) {
    // assume cardinal for now
    return new CardinalPortPosition(data.direction, data.percentage);
  }
};

module.exports = GraphParser;
