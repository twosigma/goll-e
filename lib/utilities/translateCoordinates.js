'use strict';

var cartesianToPolar = function(cartesian) {
  var polar = {
    r: Math.sqrt(cartesian.x * cartesian.x + cartesian.y * cartesian.y),
    theta: Math.atan(cartesian.y / cartesian.x)
  };
  if (cartesian.x < 0) {
    polar.theta += Math.PI;
  }
  return polar;
};

var polarToCartesian = function(polar) {
  var cartesian = {
    x: polar.r * Math.cos(polar.theta),
    y: polar.r * Math.sin(polar.theta)
  };
  return cartesian;
};

var translateCoordinates = function(originalCoordinates, newOrigin, scaleFactor, rotation) {

  // Get the coordinates of the point of interest relative to the new origin.
  var shiftedCoordinates = {
    x: originalCoordinates.x - newOrigin.x,
    y: originalCoordinates.y - newOrigin.y
  };

  // Convert those coordinates to polar.
  var polar = cartesianToPolar(shiftedCoordinates);

  // Scale the radius and subtract the rotation angle.
  polar.r *= scaleFactor;
  polar.theta -= rotation;

  // Convert the coordinates back to Cartesian.
  var result = polarToCartesian(polar);

  return result;
};

module.exports = translateCoordinates;
