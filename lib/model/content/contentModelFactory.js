var Graph = require('./graph');
var Edge = require('./edge');
var Vertex = require('./vertex');
var Port = require('./port');
var PortType = require('../../enum/portType');

var ObjectUtils = require('../../utilities/objects');
var Lang = require('../../utilities/lang');

/**
 * @class ContentModelFactory
 * @static
 */
var ContentModelFactory = {

  /**
   * Build a graph from a graph AST object (root or subGraph)
   * @method buildGraph
   * @param  {Object} data
   * @param  {Vertex} [parent]
   * @return {Graph} the built graph
   */
  build: function(data, parent) {
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
      vertexModels[id] = ContentModelFactory.buildVertex(id, vertexData, parentId);
    }, this);

    var edgeModels = {};
    ObjectUtils.each(edges, function(edgeData, id) {
      edgeModels[id] = ContentModelFactory.buildEdge(id, edgeData, vertexModels, parent);
    });

    return new Graph({
      globalId: !Lang.isValue(parentId) ? '(root)' : parentId,
      vertices: ObjectUtils.values(vertexModels),
      edges: ObjectUtils.values(edgeModels)
    });
  },

  /**
   * Build a vertex from AST spec
   * @method buildVertex
   * @param  {String} id local id
   * @param  {Object} data
   * @param  {String} [parentId]
   * @return {Vertex} the built vertex
   */
  buildVertex: function(id, data, parentId) {
    var globalId = !Lang.isValue(parentId) ? '' + id : parentId + Vertex.SCOPE_SYMBOL + id;

    var inputs = {};
    ObjectUtils.each(data.inputs, function(portData, portId) {
      inputs[portId] = ContentModelFactory.buildPort(portId, portData, PortType.INPUT, id, globalId);
    });

    var outputs = {};
    ObjectUtils.each(data.outputs, function(portData, portId) {
      outputs[portId] = ContentModelFactory.buildPort(portId, portData, PortType.OUTPUT, id, globalId);
    });

    var vertex = new Vertex({
      globalId: globalId,
      id: id,
      inputs: ObjectUtils.values(inputs),
      outputs: ObjectUtils.values(outputs),
      metadata: data.metadata
    });

    if (Lang.isObject(data.subGraph) &&
      (Object.keys(data.subGraph.vertices).length !== 0 || Object.keys(data.subGraph.edges).length !== 0)) {
      vertex.set('subGraph', ContentModelFactory.build(data.subGraph, vertex));
    }

    return vertex;
  },

  /**
   * Parse edges
   * @method buildEdge
   * @param {String} id local id
   * @param  {Object} data
   * @param  {Object} vertexModels vertex models at graph scope keyed by id
   * @param  {Graph} [parent] parent graph or null
   * @return {Edge} the built edge
   */
  buildEdge: function(id, data, vertexModels, parent) {
    var globalId = !(parent instanceof Vertex) ? id : parent.get('id') + Edge.SCOPE_SYMBOL + id;

    var getPort = function(ref) {
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
      to: getPort(data.target),
      metadata: data.metadata
    });
  },

  /**
   * Parse port
   * @method buildPort
   * @param  {String} id local id
   * @param  {Object} data
   * @param  {PortType} type
   * @param  {String} parentId
   * @param  {String} [parentGlobalId]
   * @return {Port} the built port
   */
  buildPort: function(id, data, type, parentId, parentGlobalId) {
    if (!Lang.isString(parentGlobalId)) {
      parentGlobalId = parentId;
    }

    var scopeSymbol;
    if (type === PortType.INPUT) {
      scopeSymbol = Port.SCOPE_SYMBOL_INPUT;
    } else if (type === PortType.OUTPUT) {
      scopeSymbol = Port.SCOPE_SYMBOL_OUTPUT;
    }

    var globalId = parentGlobalId + scopeSymbol + id;

    return new Port({
      id: id,
      globalId: globalId,
      ownerVertexId: parentGlobalId,
      type: type,
      metadata: data.metadata
    });
  }

};

module.exports = ContentModelFactory;
