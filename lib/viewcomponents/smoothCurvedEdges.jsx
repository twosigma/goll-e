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
  // var ctrlIn = new Array(nPoints);
  // var ctrlOut = new Array(nPoints);

  // The change between the start and end.
  // var delta = {
  //   x: inputLoc.x - outputLoc.x,
  //   y: inputLoc.y - outputLoc.y
  // };

  //pythagorize it
  // delta.distance = Math.sqrt(Math.pow(delta.x, 2) + Math.pow(delta.y, 2));

  /*
  The distance from the source/target to the nearest curve control point.
  It should be some nondecreasing function of the displacement, here's one such function.
  There may be a better one.
   */
  // var ctrlDistance = Math.min(0.3 * delta.distance, 100);
  // var ctrlDistance = 0;

  // ctrlOut[0] = getPointDistanceFromPoint(ctrlDistance, outputLoc);
  // ctrlIn[nPoints - 1] = getPointDistanceFromPoint(ctrlDistance, inputLoc);

  //http://www.codeproject.com/Articles/31859/Draw-a-Smooth-Curve-through-a-Set-of-2D-Points-wit

  if (nPoints == 2) {
    firstControlPoints[0] = {
      x: (2 * points[0].x + points[1].x) / 3,
      y: (2 * points[0].y + points[1].y) / 3
    };

    secondControlPoints[0] = {
      x: 2 * firstControlPoints[0].x - points[0].x,
      y: 2 * firstControlPoints[0].y - points[0].y
    };
  } else {
    // Right hand side vector
    var rhs = new Array(nPoints - 1);

    // Set right hand site X values
    for (var i = 1; i < nPoints - 2; i++) {
      rhs[i] = 4 * points[i].x + 2 * points[i + 1].x;
    }
    rhs[0] = points[0].x + 2 * points[1].x;
    rhs[nPoints - 2] = (8 * points[nPoints - 2].x + points[nPoints - 1].x) / 2;
    var x = getFirstControlPoints(rhs);

    // Set right hand side Y values
    for (i = 1; i < nPoints - 2; i++) {
      rhs[i] = 4 * points[i].y + 2 * points[i + 1].y;
    }
    rhs[0] = points[0].y + 2 * points[1].y;
    rhs[nPoints - 2] = (8 * points[nPoints - 2].y + points[nPoints - 1].y) / 2;
    var y = getFirstControlPoints(rhs);

    for (i = 0; i < nPoints - 1; i++) {
      firstControlPoints[i] = {x: x[i], y: y[i]};

      if (i < nPoints - 2) {
        secondControlPoints[i] = {
          x: 2 * points[i + 1].x - x[i + 1],
          y: 2 * points[i + 1].y - y[i + 1]
        };
      } else {
        secondControlPoints[i] = {
          x: (points[nPoints - 1].x + x[nPoints - 2]) / 2,
          y: (points[nPoints - 1].y + y[nPoints - 2]) / 2
        };
      }
    }

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
        firstControlPoints.map(function(p) {
          if (!p) return null;
          return (<circle className="in" r="5" cy={p.y} cx={p.x} />);
        })
      }{
        secondControlPoints.map(function(p) {
          if (!p) return null;
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
    d += instruct2D('C', firstControlPoints[i], secondControlPoints[i], points[i + 1]);

    svgPaths.push(<path key={i} className="edge-line" d={d} onMouseDown={addRerouteCb.bind(null, i)} />);
  }

  return (<g>{svgPaths}{DEBUG ? debugMarkers : null}</g>);
};

var getFirstControlPoints = function(rhs) {
  var n = rhs.length;
  var x = new Array(n);
  var tmp = new Array(n);
  var i;

  var b = 2;
  x[0] = rhs[0] / b;
  for (i = 1; i < n; i++) {
    tmp[i] = 1 / b;
    b = (i < n - 1 ? 4 : 3.5) - tmp[i];
    x[i] = (rhs[i] - [i - 1]) / b;
  }
  for (i = 1; i < n; i++) {
    x[n - i - 1] -= tmp[n - i] * x[n - i];
  }

  return x;
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