// Borrowing super-useful methods from YUI.Lang as needed and putting them here.
// Thanks Yahoo!
// http://yuilibrary.com/yui/docs/api/files/yui_js_yui-lang.js.html

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

var SUBREGEX = /\{\s*([^|}]+?)\s*(?:\|([^}]*))?\s*\}/g;

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
    return this.type(o) === 'function';
  },

  isBoolean: function(o) {
    return typeof o === 'boolean';
  },

  /**
   * Performs `{placeholder}` substitution on a string. The object passed as the
   * second parameter provides values to replace the `{placeholder}`s.
   * `{placeholder}` token names must match property names of the object. For example,
   *
   *`var greeting = Y.Lang.sub("Hello, {who}!", { who: "World" });`
   *
   * `{placeholder}` tokens that are undefined on the object map will be left
   * in tact (leaving unsightly `{placeholder}`'s in the output string).
   *
   * @method sub
   * @param {string} s String to be modified.
   * @param {object} o Object containing replacement values.
   * @return {string} the substitute result.
   * @static
   * @since 3.2.0
   */
  
  sub: function(s, o) {

    /**
    Finds the value of `key` in given object.
    If the key has a 'dot' notation e.g. 'foo.bar.baz', the function will
    try to resolve this path if it doesn't exist as a property
    @example
        value({ 'a.b': 1, a: { b: 2 } }, 'a.b'); // 1
        value({ a: { b: 2 } }          , 'a.b'); // 2
    @param {Object} obj A key/value pairs object
    @param {String} key
    @return {Any}
    @private
    **/
    function value(obj, key) {

      var subkey;

      if ( typeof obj[key] !== 'undefined' ) {
          return obj[key];
      }

      key    = key.split('.');         // given 'a.b.c'
      subkey = key.slice(1).join('.'); // 'b.c'
      key    = key[0];                 // 'a'

      // special case for null as typeof returns object and we don't want that.
      if ( subkey && typeof obj[key] === 'object' && obj[key] !== null ) {
          return value(obj[key], subkey);
      }
    }

    return s.replace ? s.replace(SUBREGEX, function (match, key) {
      var val = key.indexOf('.')>-1 ? value(o, key) : o[key];
      return typeof val === 'undefined' ? match : val;
    }) : s;
  }
};

module.exports = Lang;