/**
 * Given a set of coordinates in global space on SVGElement localEl, get the coordinates in localEl's space.
 *
 * Very useful in handlers of mouse events where localEl is e.currentTarget and localEl may be transformed.
 * @method globalToLocalCoordinates
 * @param {Number} x
 * @param {Number} y
 * @param {SVGElement} localEl
 * @return {Object} with x, y
 */
var globalToLocalCoordinates = function(x, y, localEl) {
  var svg = localEl.ownerSVGElement;
  var pt = svg.createSVGPoint();

  pt.x = x;
  pt.y = y;

  var globalPoint = pt.matrixTransform(svg.getScreenCTM().inverse());
  var globalToLocal = localEl.getTransformToElement(svg).inverse();
  var inObjectSpace = globalPoint.matrixTransform(globalToLocal);

  return inObjectSpace;
};

module.exports = globalToLocalCoordinates;