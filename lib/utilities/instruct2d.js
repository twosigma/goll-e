/**
 * Create an svg instruction like for a d.
 *
 * SVG's d attribute contains commands like "C x1, y1, x2, y2"
 *
 * This utility saves you from lots of string concatenation
 * @method instruct2D
 * @param  {String} command command name, typically one character
 * @param  {Object...} [points], any number of objects with x and y properties
 * @return {String}
 */
var instruct2d = function(command /*points...*/) {
  var points = Array.prototype.slice.call(arguments, 1);
  var flattenedPoints = [];
  points.forEach(function(point2d) {
    flattenedPoints.push(point2d.x);
    flattenedPoints.push(point2d.y);
  });

  return command + ' ' + flattenedPoints.join(', ') + ' ';
};

module.exports = instruct2d;