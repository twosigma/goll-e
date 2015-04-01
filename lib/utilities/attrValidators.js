var Lang = require('./lang');
/**
 * More validators for class attributes.
 * @class AttrValidators
 * @static
 */
var AttrValidators = {

  /**
   * Returns a function that checks if a value is an instance of the given
   * contructor isInstanceOf.
   *
   * @method isInstanceOf
   * @param {Function} ctor The contructor function
   * @returns {Function} validator function
   */
  isInstanceOf: function(ctor) {
    if (!Lang.isFunction(ctor)) {
      console.error(ctor);
      console.error('Constructor object to check against was falsy.');
      return false;
    }

    return function (val) {
      return (val instanceof ctor);
    };
  },

  /**
   * Returns a function that checks if a value is in the given constants object.
   *
   * @method isValueIn
   * @param {Object} obj The object of constants (key integer pairs)
   * @returns {Function} validator functon
   */
  isValueIn: function (obj) {
    if (!obj) {
      console.error(obj);
      console.error('Constants object to check against was falsy.');
      return false;
    }

    var values = [];

    for (var key in obj) {
      values.push(obj[key]);
    }

    return function (val) {
      return values.indexOf(val) !== -1;
    };

  },

  isArrayOf: function(type) {
    return function(val) {

      if (!Array.isArray(val)) {
        return false;
      }

      for (var i = 0; i < val.length; i++) {
        if (!(val[i] instanceof type)) {
          return false;
        }
      }

      return true;

    };
  },

  /**
   * Returns a function that checks if a value is null or passes the given
   * validator function.
   *
   * @method isNullOr
   * @param {Object} fn The other validator function
   * @returns {Function} as described
   */
  isNullOr: function (fn) {
    if (!Lang.isFunction(fn)) {
      console.error('The validator function argument is required.');
      return false;
    }
    return function (val, attrName) {
      return val === null || fn(val, attrName);
    };
  }

};

// convenience methods that return validator functions
AttrValidators.isNullOrInstanceOf = function (ctor) {
  return AttrValidators.isNullOr(AttrValidators.isInstanceOf(ctor));
};

AttrValidators.isNullOrValueIn = function(object) {
  return AttrValidators.isNullOr(AttrValidators.isValueIn(object));
};

module.exports = AttrValidators;
