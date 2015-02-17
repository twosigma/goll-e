/**
 * Utilities for js Objects
 * @class ObjectUtils
 * @static
 */

var ObjectUtils = {
  
  /**
   * Return all the values of the object as an array
   * @method values
   * @param  {Object} obj
   * @return {Array}
   */
  values: function(obj) {
    return Object.keys(obj).map(function(k) {
      return obj[k];
    });
  }
};

module.exports = ObjectUtils;
