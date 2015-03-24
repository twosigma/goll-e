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

  var firstControlPoints = new Array(nPoints - 1);
  var secondControlPoints = new Array(nPoints - 1);
  var i;


  var controlPointsX = computeControlPoints1D(points.map(function(p) {
    return p.x;
  }));
  var controlPointsY = computeControlPoints1D(points.map(function(p) {
    return p.y;
  }));

  for (i = 0; i < nPoints - 1; i++) {
    firstControlPoints[i] = {
      x: controlPointsX.firstControlPoints[i],
      y: controlPointsY.firstControlPoints[i]
    };
    secondControlPoints[i] = {
      x: controlPointsX.secondControlPoints[i],
      y: controlPointsY.secondControlPoints[i]
    }
  }


  // Now we change the first and last control points so that lines
  // come out of verticies perpendicularly. It may ruin the smoothness.

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



  if (DEBUG) {
    var debugMarkers = (<g className="debug-markers">
      <g className="ctrl-points">{
        firstControlPoints.map(function(p) {
          if (!p) return null;
          return (<circle className="first" r="5" cy={p.y} cx={p.x} />);
        })
      }{
        secondControlPoints.map(function(p) {
          if (!p) return null;
          return (<circle className="second" r="5" cy={p.y} cx={p.x} />);
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
    d += instruct2D('C', firstControlPoints[i], secondControlPoints[i], points[i + 1]);

    svgPaths.push(<path key={i} className="edge-line" d={d} onMouseDown={addRerouteCb.bind(null, i)} />);
  }

  return (<g>{svgPaths}{DEBUG ? debugMarkers : null}</g>);
};

//https://www.particleincell.com/wp-content/uploads/2012/06/bezier-spline.js

var computeControlPoints1D = function(knots) {
  var i;
  var p1 = new Array(knots.length - 1);
  var p2 = new Array(knots.length - 2);
  var n = knots.length - 1;

  /*rhs vector*/
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

  /*solves Ax=b with the Thomas algorithm (from Wikipedia)*/
  for (i = 1; i < n; i++) {
    var m = a[i] / b[i - 1];
    b[i] = b[i] -m * c[i - 1];
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