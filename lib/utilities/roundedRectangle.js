var cache = {};
/**
 * Is your <rect> rough around the edges?
 * 
 * Have a <path> and want the d?
 * 
 * Get the d attribute for a <path> to make a rounded rectangle in a simlar format to css's border - radius.
 *
 * shorthands radii:
 * top-left-and-bottom-right top-right-and-bottom-left 
 * top-left top-right-and-bottom-left bottom-right 
 * top-left top-right bottom-right bottom-left 
 * 
 * @method roundedRectanglePath
 * @param  {Number} x top left x
 * @param  {Number} y top left y
 * @param  {Number} w width
 * @param  {Number} h height
 * @param  {Number} [r1] border radius top left
 * @param  {Number} [r2] border radius top right
 * @param  {Number} [r3] border radius bottom right
 * @param  {Number} [r4] border radius bottom left
 * @return {String} a d attribute value
 */
var roundedRectanglePath = function (x,  y,  w,  h,  r1,  r2,  r3,  r4){
  var cacheKey = Array.prototype.slice.call(arguments).join();
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  if (arguments.length === 4) {
    r4 = r3 = r2 = r1 = 0;

  } else if (arguments.length === 5) {
    r4 = r3 = r2 = r1;

  } else if (arguments.length === 6) {
    r3 = r1;
    r4 = r2;

  } else if (arguments.length === 7) {
    r4 = r2;
  }


  // Thanks to http://stackoverflow.com/questions/3303772/raphael - js - rect - with - one - round - corner
  var instruct = function(command, points) {
    return command + ' ' + (points ? points.join(',') : '');
  };

  var result = [instruct('M', [x, r1 + y]), instruct('Q', [x, y, x + r1, y]),
    instruct('L', [x + w - r2, y]), instruct('Q', [x + w, y, x + w, y + r2]),
    instruct('L', [x + w, y + h - r3]), instruct('Q', [x + w, y + h,  x + w - r3, y + h]),
    instruct('L', [x + r4, y + h]), instruct('Q', [x, y + h,  x, y + h - r4]),
    instruct('Z')].join(' ');

  cache[cacheKey] = result;
  return result;
};

module.exports = roundedRectanglePath;