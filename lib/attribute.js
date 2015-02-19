// Highly modeled after the interface for YUI's Attribute.
// Though much simpler internally. 

var ObjectUtils = require('./utilities/objects');
var Lang = require('./utilities/lang');
var EventTarget = require('./eventTarget');
var augment = require('./utilities/augment');

var OPTS = {
  GETTER: 'getter',
  SETTER: 'setter',
  READ_ONLY: 'readOnly',
  INIT_ONLY: 'initOnly',
  WRITE_ONCE: 'writeOnce',
  VALIDATOR: 'validator',
  VALUE: 'value',
  VALUE_FN: 'valueFn'
};

/* 
private properties related to an attr are written to _attrState:
_setValue - takes precedence over value and valueFn, which shant be changed.
_valueWasSet - whether _setValue has been set
_writtenOnce - whether it's been set at least once
 */

var VALID_OPTIONS = ObjectUtils.values(OPTS);

var validateConfig = function(cfg) {
  for (var key in cfg) {
    if (cfg.hasOwnProperty(key) &&
      VALID_OPTIONS.indexOf(key) === -1) {
      console.error('Invalid config parameter: ' + key);
      return false;
    }
  }

  if (cfg[OPTS.READ_ONLY] && !(OPTS.VALUE in cfg)) {
    console.error('readOnly attribute ' + name + ' must have an initial value.');
    return false;
  }

  return true;
};

var stringToInstanceMethod = function(functionName) {
  if (!Lang.isFunction(this[functionName])) {
    console.error('Instance method function ' + functionName + ' does not exist.');
  }
  return this[functionName];
};

/**
 * A mixin to add something called attributes to your class.
 *
 * Attributes are an alternative to writing a lot of getters and setters
 * with private backing properties for storing and retrieving instance values.
 *
 * Attributes can be simple, or can be configured with custom 
 * getters, setters and validation functions.
 * Attributes can be specified as read-only or write-once.
 *
 * Before setting an atttribute with `set()`, 
 * it must first be configured with `addAttr()`
 * which is often done at construction.
 *
 * Attribute mixes EventTarget and fires 
 * preventable {attrName}Change and `change` events on every change
 * 
 * @class Attribute
 * @constructor
 */
var Attribute = function() {
  this._attrConfigs = {};
  this._attrStates = {};
};

Attribute.prototype = {

  addAttrs: function(configs) {
    ObjectUtils.each(configs, function(config, name) {
      this.addAttr(name, config);
    }, this);
  },

  /**
   * Adds an attribute with the provided configuration.
   * 
   *
   * The following properties are supported:
   * @param {any} config.value: the initial or "default" value
   * @param {Function|String} config.valueFn: a function to return an initial value or a string with the name
   *   of an instance methed. Useful if the inital value depends on `this`. 
   *   If both valueFn and value are defined, valueFn takes precedence.
   *   Passed the name of the attribute.
   * @param {Function|String} config.getter: a custom get handler function (or name of an instance method)
   *   It receives the value that would have been returned and has a chance to massage it.
   *   Receives: current value, name of attribute.
   *   Returns: what will be returned by a call to get(attr)
   * @param {Function|String} config.setter: a custom set handler function (or name of an instance method)
   *   It receives the value that would have been set and has a chance to massage it.
   *   Receives: current value, name of attribute.
   *   returns: the value that will actually be set
   * @param {Function|String} config.validator: a predicate function (or name of an instance method) 
   *   that must return true in order for a value to be set.
   *   Called before the setter, setting will be aborted if it returns false.
   *   Receives: the proposed value, name oy attribute, any third argument passed to set()
   * @param {Boolean} config.readOnly: boolean. If true, it cannot be set.
   * @param {Boolean} config.writeOnce: if true, it can be set once only.
   * @param {Boolean} config.initOnly: if true it can only be set in the constructor of a class created with
   *   the `createClass` utility
   *
   * For further reading see http://yuilibrary.com/yui/docs/attribute/
   * Not all of YUI's features are implemented
   * (especially the fancy stuff like lazy values), but the interface is very similar.
   *   
   * @method addAttr
   * @param  {String} name
   * @param  {Object} config
   */
  addAttr: function(name, config) {
    // protect the config
    config = Object.freeze(config);

    if (ObjectUtils.hasKey(this._attrConfigs, name)) {
      console.error('There is already an attribute with name "' + name + '"');
      return;
    }

    if (!validateConfig(config)) {
      return;
    }

    // save the config
    this._attrConfigs[name] = config;

    // create a state object
    this._attrStates[name] = {};
  },

  _validateHasAttr: function(name) {
    var config = this._attrConfigs[name];

    if (!config) {
      throw('Attribute ' + name + ' does not exist.');
    }
  },

  get: function(name) {
    var config = this._attrConfigs[name];
    var state = this._attrStates[name];

    if (!config) {
      throw new Error('No such attribute ' + name);
    }

    var value;
    var valueFn = config[OPTS.VALUE_FN];

    if (state._valueWasSet) {
      // if a value has been set, that is used.
      value = state._setValue;

    // valueFn takes precedence. Try calling it.
    } else if (Lang.isValue(valueFn)) {
      if (Lang.isString(valueFn)) {
        value = stringToInstanceMethod.bind(this)(valueFn)(name);
      } else {
        value = valueFn.bind(this)(name);
      }

      // valueFn is only used once. We store the result.
      state._valueWasSet = true;
      state._setValue = value;

    } else {
      value = config[OPTS.VALUE];
    }

    // now let the getter massage the value if it wants
    var getter = config[OPTS.GETTER];
    if (Lang.isFunction(getter)) {
      value = getter.bind(this)(value, name);
    }

    return value;
  },

  /**
   * Set a whole buncha attrs
   * @method addAttrs
   * @param  {Object} name:value
   */
  setAttrs: function(attrs) {
    ObjectUtils.each(attrs, function(value, name) {
      this.set(name, value);
    }, this);
  },

  _initAttrs: function(configs, values) {
    this.addAttrs(configs);
    ObjectUtils.each(values, function(value, name) {
      this._setAttr(name, value, null, true, true);
    }, this);
  },

  /**
   * Sets the value of an attribute (if possible).
   *
   * @method set
   * @chainable
   * @fires change
   *
   * @param {String} name The name of the attribute. 
   * @param {Any} value The value to set the attribute to.
   * @param {Object} [opts] Optional data providing the circumstances for the change.
   */
  set: function(name, val, opts) {
    return this._setAttr(name, val, opts);
  },

  /**
   * Like `set`, but allows setting of readOnly/writeOnce attributes.
   *
   * @method _set
   * @protected
   * @chainable
   *
   * @param {String} name The name of the attribute.
   * @param {Any} val The value to set the attribute to.
   * @param {Object} [opts] Optional data providing the circumstances for the change.
   */
  _set: function(name, val, opts) {
    return this._setAttr(name, val, opts, true);
  },

  /**
   * Common method to set the value of an attribute
   * @method  _set
   * @param   {String} name
   * @param   value
   * @param   [opts] can be anything. Passed to validator, setter.
   * @param   {Boolean} [force] bypass readOnly and writeOnce checks
   * @param   {Boolean} [onInit] from the constructor. don't count againt writeOnce, no events
   * @private
   */
  _setAttr: function(name, value, opts, force, onInit) {
    this._validateHasAttr(name);
    var config = this._attrConfigs[name];
    var state = this._attrStates[name];

    var prevVal = this.get(name);

    if (!force && config[OPTS.READ_ONLY]) {
      console.warn('Attribute ' + name + ' cannot be set because it is readonly');
      return false;
    }

    if (!force && config[OPTS.WRITE_ONCE] && state._writtenOnce) {
      console.warn('Attribute ' + name + ' cannot be set because it is writeOnce');
      return false;
    }

    if (!force && !onInit && config[OPTS.INIT_ONLY]) {
      console.warn('Attribute ' + name + ' cannot be set because it is initOnly');
      return false;
    }

    if (this._validate(name, value, opts, config) === false) {
      // Fixing a big YUI annoyance
      console.warn('Attribute "' + name + '" was not set to "' + value + '" because it failed validation');
      return false;
    }

    // let the setter massage it
    var setter = config[OPTS.SETTER];
    if (Lang.isFunction(setter)) {
      value = setter.bind(this)(value, name, opts);
    }

    this._fireAttrEvents(name, prevVal, value, function() {
      //actually set the value if no listeners prevented it
      state._setValue = value;
      state._valueWasSet = true;
      if (!onInit){
        state._writtenOnce = true;
      }
    });
    return this;
  },

  _fireAttrEvents: function(attrName, prevVal, newVal, cx) {
    var adtlEventParams = {
      prevVal: prevVal,
      newVal: newVal,
      name: attrName
    };

    /**
     * Two events are fired: `change` and `{attributeName}Change`
     * @event change
     * @property {any} prevVal the old value
     * @property {any} nevVal the nev value
     * @property {String} name the attr name
     */
    this.fire(attrName + 'Change', function() {
      this.fire('change', cx, adtlEventParams);
    }.bind(this), adtlEventParams);
  },

  _validate: function(name, value, opts, config) {
    // support string references to instance methods as validators
    var validator = config[OPTS.VALIDATOR];
    if (Lang.isString(validator)) {
      validator = stringToInstanceMethod.bind(this)(validator);
    }

    // validate the validator
    if (Lang.isValue(validator) && !Lang.isFunction(validator)) {
      console.warn('Validator is not a function. Wat.');
    }

    // run through validation
    if (Lang.isFunction(validator)) {
      var validationResult = validator(value, name, opts);
      if (!Lang.isBoolean(validationResult)) {
        console.warn('Validator did not return a boolean. It should.');
      }

      if (validationResult === false) {
        return false;
      }
    }

    return true;
  },

  /**
   * Get a mapping of all attributes and their value
   * @method getAttrs
   * @return {Object}
   */
  getAttrs: function() {
    var result = {};
    Object.keys(this._attrConfigs).forEach(function(attrName) {
      result[attrName] = this.get(attrName);
    }.bind(this));
    return result;
  }

};

// mix in event support
augment(Attribute, EventTarget);

module.exports = Attribute;