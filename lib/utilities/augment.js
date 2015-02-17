var ObjectUtils = require('./objects');

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
 * @function augment
 * @param  {Function} receiver a class constructor
 * @param  {Functon} provider another class constructor
 */
augment = function(receiver, provider) {
  
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

};

module.exports = augment;