var VertexLayout = require('./vertexLayout');
var PortLayout = require('./portLayout');
var EdgeLayout = require('./edgeLayout');
var CardinalPortPosition = require('./cardinalPortPosition');
var ReroutePoint = require('./reroutePoint');
var ReroutePointsList = require('./reroutePointsList');
var CardinalDirection = require('../../enum/cardinalDirection');
var ObjectUtils = require('../../utilities/objects');

var LoadedLayout = require('../layout/loadedLayout');

var DIRECTION_NAME_TO_ENUM = {
  'N': CardinalDirection.NORTH,
  'S': CardinalDirection.SOUTH,
  'E': CardinalDirection.EAST,
  'W': CardinalDirection.WEST
};

var LayoutModelFactory = {
  buildVertexLayout: function(data) {
    return new VertexLayout({
      position: data.position,
      isPinned: true
    });
  },

  buildPortLayout: function(data) {
    var positionModel = null;
    if (data.position) {
      var direction = DIRECTION_NAME_TO_ENUM[data.position.direction];
      var percentage = parseInt(data.position.percentage, 10);
      positionModel = new CardinalPortPosition({
        direction: direction,
        percentage: percentage
      });
    }

    return new PortLayout({
      position: positionModel,
      isPinned: true
    });
  },

  buildEdgeLayout: function(data) {
    var reroutePoints = new ReroutePointsList();

    for (var i = 0; i < data.position.length; ++i) {
      var pointData = data.position[i];
      var point = new ReroutePoint({
        x: pointData.x,
        y: pointData.y
      });
      reroutePoints.add(point);
    }

    return new EdgeLayout({
      isPinned: true,
      reroutePoints: reroutePoints
    });
  },

  /**
   * Given an AST, replace all loaded layout data.
   * @method loadModels
   * @param  {Object} ast
   * @returns {LoadedLayout}
   */
  build: function(ast) {
    var result = new LoadedLayout();

    ObjectUtils.each(ast.vertexLayouts, function(data, id) {
      result.put(id, this.buildVertexLayout(data));
    }, this);

    ObjectUtils.each(ast.portLayouts, function(data, id) {
      result.put(id, this.buildPortLayout(data));
    }, this);

    ObjectUtils.each(ast.edgeLayouts, function(data, id) {
      result.put(id, this.buildEdgeLayout(data));
    }, this);

    return result;
  }
};

module.exports = LayoutModelFactory;
