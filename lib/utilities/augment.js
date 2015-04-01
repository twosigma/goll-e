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
  // shallow copy metheds
  var originalMethods = ObjectUtils.merge(provider.prototype);

  /*
  Restore the original methods to the instance, replacing the wrapped ones.
   */
  var unwrapAll = function(instance) {
    for (var methodName in wrappedMethods) {
      if (wrappedMethods.hasOwnProperty(methodName)) {
        instance[methodName] = originalMethods[methodName];
      }
    }
  };

  /*
  Create a wrapped version of a method

  all provider methods are hidden away in a wrapper method that
  first calls the provider constructor, and then restores all the methods.

  This ensures the constructor is called before using any of the methods, but
  won't be called if it's never needed.
  Unwrapping all the methods ensures the constructor won't be called again.
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

  /*
  Create the wrapped methods that will actually be added to the receiving prototype.
   */
  ObjectUtils.each(provider.prototype, function(method, methodName) {
    wrappedMethods[methodName] = wrap(method);
  });

  /*
  Perform the mixin operation by mixing prototypes.
   */
  ObjectUtils.mix(receiver.prototype, wrappedMethods);

};

module.exports = augment;
