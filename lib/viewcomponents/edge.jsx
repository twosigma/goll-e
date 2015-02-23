var React = require('react');
var IO = require('./io.jsx');
var mouseDownDrag = require('../utilities/mouseDownDrag');
var PositionUtils = require('../utilities/positionUtils.js');
var CardinalDirection = require('../enum/cardinalDirection.js');
var IOLabelPosition = require('../enum/ioLabelPosition');
var CardinalPortPosition = require('../model/cardinalPortPosition');
var CartesianPortPosition = require('../model/cartesianPortPosition');
var Graph = require('../model/graph');
var Connection = require('../model/connection');




var Edge = React.createClass({

  propTypes: {
    model: React.PropTypes.instanceOf(Connection),
    container: React.PropTypes.instanceOf(Graph)
  },

  render: function() {
    var model = this.props.model;
    var container = this.props.container;

   
    return (
      <g 
      className="edge">
        <path
          className="edge-line" 
          d={lineFunction(model, container)}
          markerEnd="url(#defaultArrowhead)"
          />
      </g>
    );
  }

});

/**
 * Get the d attribute for an svg path for an edge.
 * 
 * @method lineFunction
 * @param  {Edge} model
 * @param  {Graph} graph the container in which to locate nodes
 * @return {String} the d attribute for a path
 * @private
 */
var lineFunction = function(edge, graph) {
  var line = this;
  var sourcePos = edge.getStartPositionIn(graph);
  var targetPos = edge.getEndPositionIn(graph);

  if (sourcePos === null || targetPos === null) {
    throw 'Could not find endpoint ports in this Graph. ';
    // This will be a valid state once containers are implemented.
    return null;
  }

  var xDist = targetPos.x - sourcePos.x;
  var yDist = targetPos.y - sourcePos.y;

  // is the major axis the x axis?
  var majorAxisX = Math.abs(xDist) > Math.abs(yDist);

  // the midpoint on the minor axis
  var minorMiddle = (majorAxisX ? targetPos.y + sourcePos.y : targetPos.x + sourcePos.x)/2;

  var arrowOffest;
  if (majorAxisX) {
    arrowOffest = {
      x: 0,
      y: yDist > 0 ? -5 : 5
    };
  } else {
    arrowOffest = {
      x: xDist > 0 ? -5 : 5,
      y: 0
    };
  }

  var points = {
    x1: sourcePos.x,
    y1: sourcePos.y,

    ctrl1x: majorAxisX ? sourcePos.x : minorMiddle,
    ctrl1y: majorAxisX ? minorMiddle : sourcePos.y,

    ctrl2x: majorAxisX ? targetPos.x : minorMiddle,
    ctrl2y: majorAxisX ? minorMiddle : targetPos.y,

    x2: targetPos.x + arrowOffest.x,
    y2: targetPos.y + arrowOffest.y
  };

  return 'M{x1},{y1} C{ctrl1x},{ctrl1y},{ctrl2x},{ctrl2y},{x2},{y2}'
  .replace(/\{([^\{]+)\}/g, function(_, name) {
    return points[name];
  });

};

module.exports = Edge;
