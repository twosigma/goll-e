var ObjectUtils = require('./objects');
var Attribute = require('./../attribute/attribute');

var defaultConfig = {
  extend: Object,
  use: [],
  constructor: function() {},
  instance: {},
  statics: {},
  attrs: {}
};

/**
 * Utilities for doing Object Oriented Programming in Javascript, 
 * which is often harder than it should be.
 *
 * Close that StackOverflow tab! This is your one stop oop shop.
 * @class Oop
 * @static
 */
var Oop = {
  /**
   * Mix one class into another.
   * Unlike simply mixing prototypes, this supports a constructor.
   *
   * Given two class constructors, the methods from the second are
   * copied onto the first. 
   * Just before any of the mixed in methods are executed
   * the constructor for the provider class is lazily executed.
   * The constructor will receive no arguments.
   *
   * Highly inspired by Yahoo's YUI.augment, though simpler and not feature-complete.
   * Don't look at the wizard behand the curtain! 
   * You do not want to know how this works. Even YUI calls it "voodoo".
   * 
   * @method augment
   * @param  {Function} receiver a class constructor
   * @param  {Functon} provider another class constructor
   */
  augment: function(receiver, provider) {
    
    var wrappedMethods = {};
    var originalMethods = ObjectUtils.merge(provider.prototype);

    var unwrapAll = function(instance) {
      for (var methodName in wrappedMethods) {
        if (wrappedMethods.hasOwnProperty(methodName)) {
          instance[methodName] = originalMethods[methodName];
        }
      }
    };

    /*
    all provider methods are sequestered in a wrapper method that
    first calls the provider constructor, and then unsequesters all the methods
     */
    var wrap = function(method) {
      return function() {
        // call the constructor
        provider.call(this);

        unwrapAll(this);

        // call the method they wanted in the first place
        method.apply(this, arguments);
      };
    };

    ObjectUtils.each(provider.prototype, function(method, methodName) {
      wrappedMethods[methodName] = wrap(method);
    });

    ObjectUtils.mix(receiver.prototype, wrappedMethods);

  },

  /**
   * A utility method to create classes.
   *
   * Create a class the easy way using traditional OO style.
   * (Leave that prototype nonsense behind). Attribute support is
   * included with every class.
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
   * @method createClass
   * @param  {Object} config
   * @return {Function}
   */
  createClass: function(config) {
    config = ObjectUtils.merge(defaultConfig, config);
    var parent = config.extend;
    var constructor = function BuiltClass(attrs) {
      parent.apply(this, arguments);
      this.addAttrs(config.attrs);
      if (typeof attrs === 'object') {
        this.setAttrs(attrs);
      }

      config.constructor.apply(this, arguments);
    };

    constructor.superclass = parent;

    ObjectUtils.mix(constructor.prototype, parent.prototype, config.instance);
    ObjectUtils.mix(constructor, config.statics);

    Oop.augment(constructor, Attribute);

    config.use.forEach(function(mixin) {
      Oop.augment(constructor, mixin);
    });

    return constructor;
  }
};

module.exports = Oop;