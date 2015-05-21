var VertexLayout = require('../layout/vertexLayout');
var PortLayout = require('../layout/portLayout');
var CardinalPortPosition = require('../layout/cardinalPortPosition');
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

    return result;
  }
};

module.exports = LayoutModelFactory;
