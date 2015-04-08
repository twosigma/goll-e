var createClass = require('../utilities/createClass');
var EventTarget = require('../utilities/eventTarget');
var Lang = require('../utilities/lang');
var AttrValidators = require('../utilities/attrValidators');

var validateKey = function(key) {
  if (!Lang.isString(key)) {
    throw new Error('Key must be a string');
  }
};

var Dictionary = createClass({
  mixins: [EventTarget],
  constructor: function() {
    this._backing = {};
  },
  instance: {
    /**
     * Put or override a value in the dictionary
     * @method put
     * @fires add
     * @param  {String} key
     * @param  {Any} value (non-null, defined)
     */
    put: function(key, value) {
      validateKey(key);

      if (!Lang.isValue(value)) {
        throw new Error('Value must be a value. Use remove to remove entries.');
      }

      var validCtor = this.get('validCtor');
      if (validCtor && !(value instanceof validCtor)) {
        throw new Error('Value not instanceof ' + validCtor + '.');
      }

      var eventType = this.hasKey(key) ? 'update' : 'add';

      /**
       * A value was put into the dictionary.
       * @event add
       * @property {String} key the key for the add
       * @property {Any} value the value that was added
       */
      /**
       * A value was overridden into the dictionary.
       * @event update
       * @property {String} key the key for the add
       * @property {Any} value the value that was added
       * @property {Any} prevVal old value
       */
      this.fire(eventType, function() {
        this._backing[key] = value;
      }.bind(this), {
        key: key,
        value: value,
        prevVal: this._backing[key]
      });
    },

    /**
     * Get a value from the dictionary.
     * @method fetch
     * @param  {String} key
     * @return {Any} the value
     */
    fetch: function(key) {
      validateKey(key);

      if (this.hasKey(key)) {
        return this._backing[key];

      } else {
        var defaultValueFn = this.get('defaultValueFn');
        if (defaultValueFn !== null) {
          return defaultValueFn(key, this);
        } else {
          return this.get('defaultValue');
        }

        return this._backing[key];
      }
    },

    /**
     * Delete a value from the map
     * @method remove
     * @fires remove
     * @param  {String} key
     * @return {Any} removed value
     */
    remove: function(key) {
      validateKey(key);

      var value = this.fetch(key);

      if (!this.hasKey(key)) {
        return null;
      }

      /**
       * A value was removed from the map
       * @event remove
       * @property {String} key the key that was used to remove a value
       */
      this.fire('remove', function() {
        delete this._backing[key];
      }.bind(this), {
        key: key,
        value: value
      });

      return value;
    },

    hasKey: function(key) {
      validateKey(key);

      return key in this._backing;
    }
  },

  attrs: {
    /**
     * All values must be instance of this
     * @attribute validCtor
     * @type      null|Function
     */
    validCtor: {
      value: null,
      validator: AttrValidators.isNullOr(Lang.isFunction),
      initOnly: true
    },

    /**
     * When getting a nonexistant value, this will be returned.
     * @attribute defaultValue
     * @type      {Any}
     * @default null
     */
    defaultValue: {
      value: null
    },

    /**
     * When getting a nonexistant value, called with key and dictionary.
     * Returned value will be returned from get call. It is the function's
     * responsibility to store it in the dictionary.
     * (Takes precedence over defaultValue)
     * @attribute defaultValueFn
     * @type      Function|null
     */
    defaultValueFn: {
      value: null,
      validator: AttrValidators.isNullOr(Lang.isFunction)
    }
  }
});

module.exports = Dictionary;
