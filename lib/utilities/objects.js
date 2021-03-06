/**
 * Utilities for js Objects
 * @class ObjectUtils
 * @static
 */
var hasOwn = Object.prototype.hasOwnProperty;
var owns = function (obj, key) {
  return !!obj && hasOwn.call(obj, key);
};

var ObjectUtils = {

  /**
   * Return all the values of the object as an array
   * @method values
   * @param  {Object} obj
   * @return {Array} values array
   */
  values: function(obj) {
    return Object.keys(obj).map(function(k) {
      return obj[k];
    });
  },

  /**
   * Copy properties from objects sucessively into a new object.
   * Providing just one object can act as a shallow copier.
   * @method merge
   * @return {Object} new object
   */
  merge: function(/*objects...*/) {
    var len = arguments.length;
    var result = {};
    var key;
    var obj;

    for (var i = 0; i < len; i++) {
      obj = arguments[i];
      for (key in obj) {
        if (hasOwn.call(obj, key)) {
          result[key] = obj[key];
        }
      }
    }

    return result;
  },

  hasKey: function(obj, needle) {
    for (var key in obj) {
      if (key === needle) {
        return true;
      }
    }

    return false;
  },

  each: function (obj, fn, thisObj) {
    var key;

    for (key in obj) {
      if (owns(obj, key)) {
        fn.call(thisObj || this, obj[key], key, obj);
      }
    }
  },

  /**
   * Copy properties from objects sucessively into the first object.
   * @method mix
   * @param {Object} receiver object to get properties
   * @param {...Object} providers any number of objects to provide properties.
   */
  mix: function(receiver /*, providers */) {
    var len = arguments.length;
    var key;
    var obj;

    for (var i = 1; i < len; i++) {
      obj = arguments[i];
      for (key in obj) {
        if (hasOwn.call(obj, key)) {
          receiver[key] = obj[key];
        }
      }
    }
  }

};

module.exports = ObjectUtils;
