var React = require('react');
var mouseDownDrag = require('../utilities/mouseDownDrag');
var PositionUtils = require('../utilities/positionUtils.js');
var CardinalDirection = require('../enum/cardinalDirection.js');
var CardinalPortPosition = require('../model/cardinalPortPosition');
var CartesianPortPosition = require('../model/cartesianPortPosition');
var Graph = require('../model/graph');
var Edge = require('../model/edge');




var Edge = React.createClass({

  propTypes: {
    model: React.PropTypes.instanceOf(Edge),
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

  var sourcePos = edge.getStartPositionIn(graph);
  sourcePos.angle = normalizeAngle(sourcePos.angle);
  var targetPos = edge.getEndPositionIn(graph);
  targetPos.angle = normalizeAngle(targetPos.angle);

  // The change between the start and end.
  var delta = {
    x: targetPos.x - sourcePos.x,
    y: targetPos.y - sourcePos.y
  };
  // calculate the angle of the line
  delta.angle = Math.atan(delta.y/delta.x);
  if (delta.x < 0) {
    // because the arctan function has a limited range.
    delta.angle += Math.PI;
  }
  delta.angle = normalizeAngle(delta.angle);
  //pythagorize it
  delta.len = Math.sqrt(Math.pow(delta.x, 2) + Math.pow(delta.y, 2));

  /*
  The distance from the source/target to the nearest curve control point.
  It should be some nondecreasing function of the line length, here's one such function.
  There may be a better one.
   */
  var ctrlDistance = Math.min(0.3 * delta.len, 100);

  var ctrl1 = getPointDistanceFromPoint(ctrlDistance, sourcePos);
  var ctrl2 = getPointDistanceFromPoint(ctrlDistance, targetPos);

  var points = {
    x1: sourcePos.x,
    y1: sourcePos.y,

    ctrl1x: ctrl1.x,
    ctrl1y: ctrl1.y,

    ctrl2x: ctrl2.x,
    ctrl2y: ctrl2.y,

    x2: targetPos.x,
    y2: targetPos.y
  };

  return 'M{x1},{y1} C{ctrl1x},{ctrl1y},{ctrl2x},{ctrl2y},{x2},{y2}'
    .replace(/\{([^\{]+)\}/g, function(_, name) {
    return points[name];
  });

};


var normalizeAngle = function(a) {
  a = a % (2 * Math.PI);
  return a < 0 ? a + (2 * Math.PI) : a;
};


/*
The provided point is a point with a direction angle.
Returns a new point `distance` away in the direction of `point.angle`
 */
var getPointDistanceFromPoint = function(distance, point) {
  return {
    x: point.x + distance * Math.cos(point.angle),
    y: point.y - distance * Math.sin(point.angle)
  };
};


module.exports = Edge;
