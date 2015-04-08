var VertexLayout = require('../model/layout/vertexLayout');
var PortLayout = require('../model/layout/portLayout');
var CardinalPortPosition = require('../model/layout/cardinalPortPosition');
var CardinalDirection = require('../enum/cardinalDirection');
var ObjectUtils = require('../utilities/objects');

var loadedLayout = require('../model/layout/loadedLayout');

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
   * Givin an ast, replace all loaded layout data.
   * @method loadModels
   * @param  {Object} ast
   */
  loadModels: function(ast) {
    loadedLayout.removeAll(true);

    ObjectUtils.each(ast.vertexLayouts, function(data, id) {
      loadedLayout.put(id, this.buildVertexLayout(data));
    }, this);

    ObjectUtils.each(ast.portLayouts, function(data, id) {
      loadedLayout.put(id, this.buildPortLayout(data));
    }, this);
  }
};

module.exports = LayoutModelFactory;
