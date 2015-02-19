/**
 * Utilities for js Objects
 * @class ObjectUtils
 * @static
 */
var ObjectUtils = {
  /**
   * Return all the values of the object as an array
   * @method values
   * @param  {Object} obj The object.
   * @return {Array} An array containing all property values from the object.
   */
  values: function(obj) {
    return Object.keys(obj).map(function(k) {
      return obj[k];
    });
  }
};

module.exports = ObjectUtils;
