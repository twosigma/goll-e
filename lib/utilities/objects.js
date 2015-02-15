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
   * @return {Array}
   */
  values: function(obj) {
    return Object.keys(obj).map(function(k) {
      return obj[k];
    });
  },

  /**
   * Copy properties from objects sucessively into a new object.
   * @method merge
   * @return {Object}
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

  hasKey: function(obj, key) {
    for (key in obj) {
      if (key[i] === key) {
        return true;
      }
    }

    return false;
  },

  each: function (obj, fn, thisObj, proto) {
    var key;

    for (key in obj) {
      if (proto || owns(obj, key)) {
        fn.call(thisObj || this, obj[key], key, obj);
      }
    }
  }
};

module.exports = ObjectUtils;