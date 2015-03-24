var React = require('react');

/*
Enable drawing of control points
 */
var DEBUG = true;

/**
 * Edge drawing strategy to make bezier curved edges.
 * @function
 */
var smoothCurvedEdges = function(outputLoc, reroutePoints, inputLoc, addRerouteCb) {
  // turn outputLoc and inputLoc into plain objects just so things are consistent
  var reroutePointsPlain = reroutePoints.toArray().map(function(reroutePoint) {
    return reroutePoint.getScaled(outputLoc, inputLoc);
  });

  var points = [outputLoc].concat(reroutePointsPlain, inputLoc);
  var nPoints = points.length;
  var ctrlIn = new Array(nPoints);
  var ctrlOut = new Array(nPoints);

  // The change between the start and end.
  var delta = {
    x: inputLoc.x - outputLoc.x,
    y: inputLoc.y - outputLoc.y
  };

  //pythagorize it
  delta.distance = Math.sqrt(Math.pow(delta.x, 2) + Math.pow(delta.y, 2));

  /*
  The distance from the source/target to the nearest curve control point.
  It should be some nondecreasing function of the displacement, here's one such function.
  There may be a better one.
   */
  var ctrlDistance = Math.min(0.3 * delta.distance, 100);
  // var ctrlDistance = 0;

  ctrlOut[0] = getPointDistanceFromPoint(ctrlDistance, outputLoc);
  ctrlIn[nPoints - 1] = getPointDistanceFromPoint(ctrlDistance, inputLoc);

  // Calculate all the control points
  for (var i = 1; i < nPoints - 1; i++) {
    // Calculated by pretending we're making quadractic curves and then doing a
    // rough conversion to cubic curves.
    // We use cubic curves because they allow custom control points for the inputs and outputs, as calculated above.
    // We want to use quadratic curves becasue they only control point for the user to specify is the reroute point.

    ctrlIn[i] = {};
    ctrlIn[i].x = points[i - 1].x + 2/3 * (points[i].x - points[i - 1].x)
    ctrlIn[i].y = points[i - 1].y + 2/3 * (points[i].y - points[i - 1].y)

    ctrlOut[i] = {};
    ctrlOut[i].x = points[i + 1].x + 2/3 * (points[i].x - points[i + 1].x)
    ctrlOut[i].y = points[i + 1].y + 2/3 * (points[i].y - points[i + 1].y)
    // pt + pt - ctrl
    // ctrlOut[i].x = 2*points[i].x - ctrlIn[i].x;
    // ctrlOut[i].y = 2*points[i].y - ctrlIn[i].y;
  }

  if (DEBUG) {
    var debugMarkers = (<g className="debug-markers">
      <g className="reroute">{/*
        reroutePointsPlain.map(function(p) {
          return (<circle r="5" cy={p.y} cx={p.x} />);
        }
      )*/}
      </g>
      <g className="ctrl-points">{
        ctrlIn.map(function(p) {
          return (<circle className="in" r="5" cy={p.y} cx={p.x} />);
        })
      }{
        ctrlOut.map(function(p) {
          return (<circle className="out" r="5" cy={p.y} cx={p.x} />);
        })
      }
      </g>
    </g>);
  }

  // we create several separate paths so that they can have separate click handlers
  // Each click handler will insert the reroute point in the correct list position.
  var svgPaths = [];

  for (i = 0; i < nPoints - 1; i++) {
    var currentPoint = points[i];

    var d = instruct2D('M', points[i]);
    d += instruct2D('C', ctrlOut[i], ctrlIn[i + 1], points[i + 1]);

    svgPaths.push(<path key={i} className="edge-line" d={d} onMouseDown={addRerouteCb.bind(null, i)} />);
  }

  return (<g>{svgPaths}{DEBUG ? debugMarkers : null}</g>);
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

var instruct2D = function(command /*points...*/) {
  var points = Array.prototype.slice.call(arguments, 1);
  var flattenedPoints = [];
  points.forEach(function(point2d) {
    flattenedPoints.push(point2d.x);
    flattenedPoints.push(point2d.y);
  });

  return command + ' ' + flattenedPoints.join(',') + ' ';
};

module.exports = smoothCurvedEdges;