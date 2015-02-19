// Borrowing super-useful methods from YUI.Lang as needed and putting them here.
// Thanks Yahoo!
// http://yuilibrary.com/yui/docs/api/files/yui_js_yui-lang.js.html

/*eslint-disable */

var TOSTRING = Object.prototype.toString;

var TYPES = {
  'undefined'        : 'undefined',
  'number'           : 'number',
  'boolean'          : 'boolean',
  'string'           : 'string',
  '[object Function]': 'function',
  '[object RegExp]'  : 'regexp',
  '[object Array]'   : 'array',
  '[object Date]'    : 'date',
  '[object Error]'   : 'error'
};

var Lang = {
  type: function(o) {
    return TYPES[typeof o] || TYPES[TOSTRING.call(o)] || (o ? 'object' : 'null');
  },

  isUndefined: function(o) {
    return typeof o === 'undefined';
  },

  /**
   * A convenience method for detecting a legitimate non-null value.
   * Returns false for null/undefined/NaN, true for other values,
   * including 0/false/''
   * @method isValue
   * @static
   * @param o The item to test.
   * @return {boolean} true if it is not null/undefined/NaN || false.
   */
   isValue: function(o) {
    var t = this.type(o);

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
  }
};

module.exports = Lang;

/*eslint-enable */
