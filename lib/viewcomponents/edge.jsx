var React = require('react');
var Graph = require('../model/graph');

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

/**
 * Get the d attribute for an svg path for an edge.
 *
 * @method lineFunction
 * @param  {Edge} edge - the edge model
 * @param  {Graph} graph the container in which to locate nodes
 * @return {String} the d attribute for a path
 * @private
 */
var lineFunction = function(edge, graph) {

  var sourcePos = edge.getStartPositionIn(graph);
  var targetPos = edge.getEndPositionIn(graph);

  // The change between the start and end.
  var delta = {
    x: targetPos.x - sourcePos.x,
    y: targetPos.y - sourcePos.y
  };

  //pythagorize it
  delta.distance = Math.sqrt(Math.pow(delta.x, 2) + Math.pow(delta.y, 2));

  /*
  The distance from the source/target to the nearest curve control point.
  It should be some nondecreasing function of the displacement, here's one such function.
  There may be a better one.
   */
  var ctrlDistance = Math.min(0.3 * delta.distance, 100);

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


var Edge = React.createClass({

  propTypes: {
    model: React.PropTypes.instanceOf(Edge),
    container: React.PropTypes.instanceOf(Graph),
    parentScale: React.PropTypes.number
  },

  getDefaultProps: function() {
    return {
      parentScale: 1
    };
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


module.exports = Edge;
