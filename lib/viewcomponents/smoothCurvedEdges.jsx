/* eslint-disable */
var React = require('react');
/* eslint-enable */
var globalToLocalCoordinates = require('../utilities/globalToLocalCoordinates');
var ReroutePoint = require('../model/reroutePoint');
var instruct2D = require('../utilities/instruct2d');

var computeControlPoints1D;
var getPointDistanceFromPoint;

/*
Enable drawing of control points
 */
var DEBUG = false;

/**
 * Edge drawing strategy to make bezier curved edges.
 *
 * A cubic bezier spline in calculated to pass smoothly through the output, input and reroute points.
 * The first and last controls points are placed just away from and perpendicular to the vertex, based on the port's angle.
 * (This makes it not quite smooth, ah well)
 * The spline is rendered as several path segments, with separate click handler to insert new points at the correct index.
 *
 * @param {Object} outputLoc the output port location.
 * @param {ReroutePointsList} reroutePoints list of reroute point models
 * @param {Object} inputLoc the input port location
 * @return {ReactElement} React element to draw an edge
 * @function smoothCurvedEdges
 */
var smoothCurvedEdges = function(outputLoc, reroutePoints, inputLoc) {
  // Let's make Adobe Illustrator! Specifically, the Curvature Tool…

  // callback when clicking edges
  var addRerouteCb = function(index, e) {
    var localCoords = globalToLocalCoordinates(e.clientX, e.clientY, e.currentTarget);
    var reroutePoint = ReroutePoint.createFromRelative(localCoords.x, localCoords.y, outputLoc, inputLoc);

    reroutePoints.add(reroutePoint, index);
  };

  // turn reroute points into plain objects with absolute coordinates in local space
  var reroutePointsPlain = reroutePoints.toArray().map(function(reroutePoint) {
    return reroutePoint.getAbsolute(outputLoc, inputLoc);
  });

  // make an array of all the knots in the spline
  var points = [outputLoc].concat(reroutePointsPlain, inputLoc);
  var nPoints = points.length;

  var i;
  // 0..n-1 the first point nearest to each knot. Note that [0] is the control point going out of the output, others in.
  var firstControlPoints = new Array(nPoints - 1);
  // 0..n-1 the second point nearest to each knot.
  var secondControlPoints = new Array(nPoints - 1);

  // separate into x and y and calculate each dimension separately.
  var x = new Array(nPoints);
  var y = new Array(nPoints);
  for (i = 0; i < nPoints; i++) {
    x[i] = points[i].x;
    y[i] = points[i].y;
  }

  var controlPointsX = computeControlPoints1D(x);
  var controlPointsY = computeControlPoints1D(y);

  // put them back into x,y objects for convenience
  for (i = 0; i < nPoints - 1; i++) {
    firstControlPoints[i] = {
      x: controlPointsX.firstControlPoints[i],
      y: controlPointsY.firstControlPoints[i]
    };
    secondControlPoints[i] = {
      x: controlPointsX.secondControlPoints[i],
      y: controlPointsY.secondControlPoints[i]
    };
  }

  // Now we change the first and last control points so that lines
  // come out of verticies perpendicularly.
  // It may ruin the smoothness and continuity of the second derivative, but looks right.

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

  firstControlPoints[0] = getPointDistanceFromPoint(ctrlDistance, outputLoc);
  secondControlPoints[nPoints - 2] = getPointDistanceFromPoint(ctrlDistance, inputLoc);

  /* if debug mode is on, create objects to indicate the control points */
  var debugMarkers;
  if (DEBUG) {
    debugMarkers = (<g className="debug-markers">
      <g className="ctrl-points">{
        firstControlPoints.map(function(p, k) {
          return (<circle className="first" key={k} r="5" cy={p.y} cx={p.x} />);
        })
      }{
        secondControlPoints.map(function(p, k) {
          return (<circle className="second" key={k} r="5" cy={p.y} cx={p.x} />);
        })
      }
      </g>
    </g>);
  }

  // we create several separate paths so that they can have separate click handlers
  // Each click handler will insert the reroute point in the correct list position.
  var svgPaths = [];

  for (i = 0; i < nPoints - 1; i++) {
    var d = instruct2D('M', points[i]);
    d += instruct2D('C', firstControlPoints[i], secondControlPoints[i], points[i + 1]);

    var markerEnd = i === nPoints - 2 ? 'url(#defaultArrowhead)' : undefined;

    svgPaths.push(<path key={i} className="edge-line" d={d} onMouseDown={addRerouteCb.bind(null, i)} markerEnd={markerEnd} />);
  }

  return (<g>{svgPaths}{DEBUG ? debugMarkers : null}</g>);
};

//https://www.particleincell.com/wp-content/uploads/2012/06/bezier-spline.js
/**
 * Compute the control points for a smooth bezier spline passing through the fixed "knot" points.
 * Smooth is defined as continuous in all possible derivaties, which is first and second for this cubic curve.
 *
 * This is taken from https://www.particleincell.com/2012/bezier-splines/ which explains the math and variables here.
 * Constants are coefficcients which were derived. Not arbitrary.
 * Here's another useful reference on the topic: http://www.math.ucla.edu/~baker/149.1.02w/handouts/dd_splines.pdf
 * The Thomas algorithm for solving tridiagonal systems of equations: http://en.wikipedia.org/wiki/Tridiagonal_matrix_algorithm
 *
 * @method computeControlPoints1D
 * @param  {Array} knots array of 1d coordinates (numbers)
 * @return {Object} containing two arrays keyed by firstControlPoints and secondControlPoints
 */
computeControlPoints1D = function(knots) {
  var i;
  // first control points
  var p1 = new Array(knots.length - 1);
  // second control points
  var p2 = new Array(knots.length - 2);
  // note that n is not the number of knots but the number of controls / 2
  var n = knots.length - 1;

  /*right hand side vector*/
  var a = new Array(n);
  var b = new Array(n);
  var c = new Array(n);
  var r = new Array(n);

  /*left most segment*/
  a[0] = 0;
  b[0] = 2;
  c[0] = 1;
  r[0] = knots[0] + 2 * knots[1];

  /*internal segments*/
  for (i = 1; i < n; i++) {
    a[i] = 1;
    b[i] = 4;
    c[i] = 1;
    r[i] = 4 * knots[i] + 2 * knots[i + 1];
  }

  /* right segment */
  a[n - 1] = 2;
  b[n - 1] = 7;
  c[n - 1] = 0;
  r[n - 1] = 8 * knots[n - 1] + knots[n];

  /* solves Ax=b with the Thomas algorithm (from Wikipedia)*/
  for (i = 1; i < n; i++) {
    var m = a[i] / b[i - 1];
    b[i] = b[i] - m * c[i - 1];
    r[i] = r[i] - m * r[i - 1];
  }

  p1[n - 1] = r[n - 1] / b[n - 1];
  for (i = n - 2; i >= 0; --i){
    p1[i] = (r[i] - c[i] * p1[i + 1]) / b[i];
  }

  /*we have p1, now compute p2*/
  for (i = 0; i < n - 1; i++) {
    p2[i] = 2 * knots[i + 1] - p1[i + 1];
  }

  p2[n - 1] = 0.5 * (knots[n] + p1[n - 1]);

  return {
    firstControlPoints: p1,
    secondControlPoints: p2
  };
};

/*
The provided point is a point with a direction angle.
Returns a new point `distance` away in the direction of `point.angle`
 */
getPointDistanceFromPoint = function(distance, point) {
  return {
    x: point.x + distance * Math.cos(point.angle),
    y: point.y - distance * Math.sin(point.angle)
  };
};

module.exports = smoothCurvedEdges;
