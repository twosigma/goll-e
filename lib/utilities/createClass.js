var ObjectUtils = require('./objects');
var Attribute = require('./../attribute');
var augment = require('./augment');

var defaultConfig = {
  extend: Object,
  use: [],
  constructor: function() {},
  instance: {},
  statics: {},
  attrs: {}
};

/**
 * A utility method to create classes.
 *
 * Create a class easily using traditional OO style.
 * Powerful Attribute support is included with every class.
 *
 * Takes a configuration object with any of the following properties
 *
 * - extend: the constructor for a class to extend 
 *   (will be availible via the superclass property)
 * - use: An array of constructors of mixins to augment this class with.
 *   Mixin methods will override any instance methods on the class.
 *   Mixins may have useful constructors, though they won't receive arguments.
 * - constructor: the class constructor.
 *   The constructor will receive an object of attributes
 *   which are set before the constructor is called.
 * - instance: an object of instance variables and methods
 * - statics: an object with static properties and functions
 * - attrs: an object with attribute configs.
 *   (Powerful!) See Attribute.addAttr for full documentation.
 *   Attributes can be inherited.
 * @method createClass
 * @param  {Object} config
 * @return {Function}
 */
createClass = function(config) {
  config = ObjectUtils.merge(defaultConfig, config || {});
  var parent = config.extend;

  var parentAttrs = typeof parent.ATTRS === 'object' ? parent.ATTRS : {};
  var attrConfigs = ObjectUtils.merge(parentAttrs, config.attrs);

  var constructor = function BuiltClass(attrs) {
    var thisIsLowestClass = !this.__isNotLowestClass;

    if (thisIsLowestClass) {
      this._initAttrs(attrConfigs, typeof attrs === 'object' ? attrs : {});
    }
    
    this.__isNotLowestClass = true;
    parent.apply(this, arguments);

    config.constructor.apply(this, arguments);
  };

  constructor.superclass = parent;
  constructor.ATTRS = attrConfigs;

  // the magical mess of prototypical inheritance
  constructor.prototype = Object.create(parent.prototype);
  ObjectUtils.mix(constructor.prototype, config.instance);
  constructor.prototype.constructor = constructor;
  ObjectUtils.mix(constructor, config.statics);

  augment(constructor, Attribute);

  config.use.forEach(function(mixin) {
    augment(constructor, mixin);
  });

  return constructor;
};

module.exports = createClass;