// Highly modeled after the interface for YUI's Attribute.
// Though much simpler internally.

var ObjectUtils = require('./objects');
var Lang = require('./lang');
var EventTarget = require('./eventTarget');
var augment = require('./augment');

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

var FAIL = {};

///////////////////////
// Utility functions //
///////////////////////

/*
private properties related to an attr are written to _attrState:
_setValue - takes precedence over value and valueFn, which shant be changed.
_valueWasSet - whether _setValue has been set
_writtenOnce - whether it's been set at least once
 */

var VALID_OPTIONS = ObjectUtils.values(OPTS);

/**
 * Perform sanity checks on an attr config.
 * Reject unknown parameters.
 * @method validateConfig
 * @param  {Object} cfg
 * @param  {String} name name of attr
 * @returns {Boolean} is valid
 */
var validateConfig = function(cfg, name) {
  for (var key in cfg) {
    if (cfg.hasOwnProperty(key) &&
      VALID_OPTIONS.indexOf(key) === -1) {
      console.error('Invalid config parameter: ' + key);
      return false;
    }
  }

  if (cfg[OPTS.READ_ONLY] && !((OPTS.VALUE in cfg) || (OPTS.VALUE_FN in cfg))) {
    console.error('readOnly attribute ' + name + ' must have an initial value.');
    return false;
  }

  // validate the validator
  if (Lang.isValue(cfg[OPTS.VALIDATOR]) && !Lang.isFunction(cfg[OPTS.VALIDATOR])) {
    console.error('Validator for ' + name + ' is not a function.');
    return false;
  }

  return true;
};

/**
 * Get an instance method on this by name, logging an error if it does not exist.
 * @method stringToInstanceMethod
 * @param  {String} functionName
 * @return {Function} the instance method
 */
var stringToInstanceMethod = function(functionName) {
  if (!Lang.isFunction(this[functionName])) {
    console.error('Instance method function ' + functionName + ' does not exist.');
  }
  return this[functionName];
};

/**
 * Validate a propesed value through the attribute's validator if it has one.
 * @function userValidation
 * @param  {String} name
 * @param  {*} value
 * @param  {Object} [opts]
 * @return {Boolean} passed validation
 */
var userValidation = function(name, value, opts) {
  var config = this._attrConfigs[name];
  // support string references to instance methods as validators
  var validator = config[OPTS.VALIDATOR];
  if (Lang.isString(validator)) {
    validator = stringToInstanceMethod.bind(this)(validator);
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
};

////////////////////////////////////////////////
// Helper methods. Call with instance context //
////////////////////////////////////////////////

var sanityCheckValue = function(name, value, force, onInit) {
  var config = this._attrConfigs[name];

  if (!config) {
    throw new Error('Attribute ' + name + ' does not exist.');
  }

  var state = this._attrStates[name];


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

  return true;
};

var prepareValue = function(name, value, opts, force, onInit) {
  var config = this._attrConfigs[name];

  if (!sanityCheckValue.call(this, name, value, force, onInit)) {
    return FAIL;
  }

  if (userValidation.call(this, name, value, opts, config) === false) {
    // Fixing a big YUI annoyance
    console.warn('Attribute "' + name + '" was not set to "' + value + '" because it failed validation');
    return FAIL;
  }

  // let the setter massage it
  var setter = config[OPTS.SETTER];
  if (Lang.isFunction(setter)) {
    value = setter.bind(this)(value, name, opts);
  }

  return value;
};

/**
 * Performs the actual value setting.
 * @function  _setValueHelper
 * @param {String} name attr name
 * @param {*} value value to set
 * @param {Boolean} [onInit] true of this is being set on constructon
 * @private
 */
var setValueHelper = function(name, value, onInit) {
  var state = this._attrStates[name];

  //actually set the value if no listeners prevented it
  state._setValue = value;
  state._valueWasSet = true;
  if (!onInit){
    state._writtenOnce = true;
  }
};

/**
 * Common method to set the value of an attribute
 * @function  setAttr
 * @param   {String} name
 * @param   {*} value value to set
 * @param   {*} [opts] can be *thing. Passed to validator, setter.
 * @param   {Boolean} [force] bypass readOnly and writeOnce checks
 * @param   {Boolean} [onInit] from the constructor. don't count againt writeOnce, no events
 * @private
 */
var setAttr = function(name, value, opts, force, onInit) {
  value = prepareValue.call(this, name, value, opts, force, onInit);
  if (value === FAIL) {
    return;
  }

  var adtlEventParams = {
    prevVal: this.get(name),
    newVal: value,
    name: name
  };

  if (opts) {
    ObjectUtils.mix(adtlEventParams, opts);
  }

  /**
  * Two events are fired: `change` and `{attributeName}Change`
  * @event change
  * @property {*} prevVal the old value
  * @property {*} nevVal the nev value
  * @property {String} name the attr name
  */
  this.fire('change', function() {
    this.fire(name + 'Change', function() {
      setValueHelper.call(this, name, value, onInit);
    }.bind(this), adtlEventParams);
  }.bind(this), adtlEventParams);

  return;
};


//////////////////////
// Class definition //
//////////////////////

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

  /**
   * Configure several attributes at once.
   * Accepts an object mapping attribute names to config objects.
   * See #addAttr for detail on the config object.
   * @method addAttrs
   * @param  {[type]} configs
   */
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
   * @param {*} config.value: the initial or "default" value
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

    if (!validateConfig(config, name)) {
      return;
    }

    // save the config
    this._attrConfigs[name] = config;

    // create a state object
    this._attrStates[name] = {};
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

  _initAttrs: function(configs, values) {
    this.addAttrs(configs);
    ObjectUtils.each(values, function(value, name) {
      setAttr.call(this, name, value, null, true, true);
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
   * @param {Any} val The value to set the attribute to.
   * @param {Object} [opts] Optional data providing the circumstances for the change.
   */
  set: function(name, val, opts) {
    setAttr.call(this, name, val, opts);
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
    setAttr.call(this, name, val, opts, true);
  },

  /**
   * Set a whole buncha attrs.
   *
   * Fires the generic change event's "on" before all and "after" after all are set.
   * This is the least noisy way to set several attributes from the point of view of listeners of "change."
   * @method addAttrs
   * @param {Object} attrs name:value
   */
  setAttrs: function(attrs) {
    var newVals = {};
    var prevVals = {};
    ObjectUtils.each(attrs, function(value, name) {
      var newVal = prepareValue.call(this, name, value);
      if (newVal !== FAIL) {
        newVals[name] = value;
        prevVals[name] = this.get(name);
      }
    }, this);

    var adtlEventParams = {
      newVals: newVals,
      prevVals: prevVals,
      multi: true
    };

    this.fire('change', function() {
      ObjectUtils.each(newVals, function(newVal, name) {

        var adtlSpecificEventParams = {
          prevVal: prevVals[name],
          newVal: newVal,
          name: name
        };

        this.fire(name + 'Change', function() {
          setValueHelper.call(this, name, newVal);
        }.bind(this), adtlSpecificEventParams);

      }, this);
    }.bind(this), adtlEventParams);
  },

  /**
   * Get a mapping of all attributes and their value
   * @method getAttrs
   * @return {Object} such a mapping
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
