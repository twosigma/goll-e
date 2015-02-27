var Graph = require('../model/graph');
var Edge = require('../model/edge');
var Vertex = require('../model/vertex');
var Port = require('../model/port');
var PortType = require('../enum/portType');

var ObjectUtils = require('../utilities/objects');
var Lang = require('../utilities/lang');


var SCOPE_SYMBOLS = {
  VERTEX: '>',
  INPUT: '+',
  OUTPUT: '-',
  EDGE: '>'
};

var INVALID_ID_CHARS = ObjectUtils.values(SCOPE_SYMBOLS);

/**
 * @class ModelFactory
 * @static
 */
var ModelFactory = {

  parseGraph: function(data, parent) {
    var parentId = null;
    if (!(parent instanceof Vertex)) {
      parent = null;
    } else {
      parentId = parent.get('globalId');
    }

    var vertices = data.vertices;
    var edges = data.edges;

    var vertexModels = {};
    ObjectUtils.each(vertices, function(vertexData, id) {
      vertexModels[id] = ModelFactory.parseVertex(id, vertexData, parentId);
    }, this);

    var edgeModels = {};
    ObjectUtils.each(edges, function(edgeData, id) {
      edgeModels[id] = ModelFactory.parseEdge(id, edgeData, vertexModels, parent);
    });

    return new Graph({
      vertices: ObjectUtils.values(vertexModels),
      edges: ObjectUtils.values(edgeModels)
    });
  },

  parseVertex: function(id, data, parentId) {
    var globalId = !Lang.isValue(parentId) ? '' + id : parentId + SCOPE_SYMBOLS.VERTEX  + id;

    var inputs = {};
    ObjectUtils.each(data.inputs, function(portData, portId) {
      inputs[portId] = ModelFactory.parsePort(portId, portData, PortType.INPUT, id, globalId);
    });

    var outputs = {};
    ObjectUtils.each(data.outputs, function(portData, portId) {
      outputs[portId] = ModelFactory.parsePort(portId, portData, PortType.OUTPUT, id, globalId);
    });

    var vertex = new Vertex({
      globalId: globalId,
      id: id,
      inputs: ObjectUtils.values(inputs),
      outputs: ObjectUtils.values(outputs),
      metadata: data.metadata
    });

    if ('subGraph' in data) {
      vertex.set('subGraph', ModelFactory.parseGraph(data.subGraph, vertex));
    }

    return vertex;
  },

  /**
   * Parse edges
   * @method parseEdge
   * @param {String} id local id
   * @param  {Object} data
   * @param  {Object} vertexModels vertex models at graph scope
   * @param  {Graph} [parent] parent graph or null
   * @return {Edge}
   */
  parseEdge: function(id, data, vertexModels, parent) {
    var globalId = !(parent instanceof Vertex) ? id : parent.get('id') + SCOPE_SYMBOLS.EDGE  + id;

    var getPort = function(ref) {
      // debugger;
      var vertex;
      if (ref.vertexId === null && parent instanceof Vertex) {
        vertex = parent;
      } else {
        vertex = vertexModels[ref.vertexId];
      }

      if (ref.portId === null) {
        return vertex.get('defaultPort');
      }
      return vertex.getPortById(ref.portId);
    };

    return new Edge({
      globalId: globalId,
      id: id,
      from: getPort(data.source),
      to: getPort(data.target)
    });
  },

  /**
   * Parse port
   * @method parsePort
   * @param  {String} id local id
   * @param  {Object} data
   * @param  {PortType} type
   * @param  {String} parentId
   * @param  {String} [parentGlobalId]
   * @return {Port}
   */
  parsePort: function(id, data, type, parentId, parentGlobalId) {
    if (!Lang.isString(parentGlobalId)) {
      parentGlobalId = parentId;
    }

    var scopeSymbol;
    if (type === PortType.INPUT) {
      scopeSymbol = SCOPE_SYMBOLS.INPUT;
    } else if (type === PortType.OUTPUT) {
      scopeSymbol = SCOPE_SYMBOLS.OUTPUT;
    }

    var globalId = parentGlobalId + scopeSymbol + id;

    return new Port({
      id: id,
      globalId: globalId,
      type: type,
      metadata: data.metadata
    });
  }

};

module.exports = ModelFactory;
