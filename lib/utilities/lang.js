// Borrowing super-useful methods from YUI.Lang as needed and putting them here.
// Thanks Yahoo!
// http://yuilibrary.com/yui/docs/api/files/yui_js_yui-lang.js.html

var TOSTRING = Object.prototype.toString;

var TYPES = {
  'undefined': 'undefined',
  'number': 'number',
  'boolean': 'boolean',
  'string': 'string',
  '[object Function]': 'function',
  '[object RegExp]': 'regexp',
  '[object Array]': 'array',
  '[object Date]': 'date',
  '[object Error]': 'error'
};

/**
 * Basic language utilities becaause javascript needs some help.
 * @class Lang
 * @static
 */
var Lang = {
  type: function(o) {
    return TYPES[typeof o] || TYPES[TOSTRING.call(o)] || (o ? 'object' : 'null');
  },

  isUndefined: function(o) {
    return typeof o === 'undefined';
  },

  /**
   * >> super useful <<
   * What you think you're doing with `if (object)`
   *
   * A convenience method for detecting a legitimate non-null value.
   * Returns false for null/undefined/NaN, true for other values,
   * including 0/false/''
   * @method isValue
   * @static
   * @param o The item to test.
   * @return {boolean} true if it is not null/undefined/NaN || false.
   */
  isValue: function(o) {
    var t = Lang.type(o);

    switch (t) {
      case 'number':
        return isFinite(o);

      case 'null': // fallthru
      case 'undefined':
        return false;

      default:
        return !!t;
    }
  },

  /**
   * Determines whether or not the provided item is a string.
   * @method isString
   * @static
   * @param o The object to test.
   * @return {boolean} true if o is a string.
   */
  isString: function(o) {
    return typeof o === 'string';
  },

  /**
   * Determines whether or not the provided item is a legal number.
   * @method isNumber
   * @static
   * @param o The object to test.
   * @return {boolean} true if o is a number.
   */
  isNumber: function(o) {
    return typeof o === 'number' && isFinite(o);
  },

  /**
   * Determines whether or not the provided item is a function.
   * Note: Internet Explorer thinks certain functions are objects:
   *
   * var obj = document.createElement("object");
   * Y.Lang.isFunction(obj.getAttribute) // reports false in IE
   *
   * var input = document.createElement("input"); // append to body
   * Y.Lang.isFunction(input.focus) // reports false in IE
   *
   * @method isFunction
   * @static
   * @param o The object to test.
   * @return {boolean} true if o is a function.
   */
  isFunction: function(o) {
    return Lang.type(o) === 'function';
  },

  isBoolean: function(o) {
    return typeof o === 'boolean';
  },

  /**
   * Is it an object? Note that arrays are objects.
   * @method isObject
   * @param  o for testing
   * @param  {Boolean} [failfn] fail on functions
   * @return {Boolean}
   */
  isObject: function(o, failfn) {
    var t = typeof o;
    return (o && (t === 'object' ||
      (!failfn && Lang.isFunction(o)))) || false;
  },

  isArray: Array.isArray


};

module.exports = Lang;
