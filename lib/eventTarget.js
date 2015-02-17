var ObjectUtils = require('./utilities/objects');
var Lang = require('./utilities/lang');
/**
 * A simple implementation of the observer pattern.
 * Mix me into your class with augment.
 * @method EventTarget
 */
var EventTarget = function EventTarget() {
  this.__topics = {};
};

/** a simple event facade */
var Event = function Event(topic, target) {
  this.defaultPrevented = false;
  this.topic = topic;
  this.target = target;
};

Event.prototype = {
  /**
   * Stop the default action from occuring if it has not yet executed.
   * @method preventDefault
   * @return {[type]}
   */
  preventDefault: function() {
    this.defaultPrevented = true;
  }
};

EventTarget.prototype = {
  on: function(topic, callback, context /*adtl args*/) {
    return this._registerEvent('on', topic, callback, context, Array.prototype.slice.call(arguments, 3));
  },

  after: function(topic, callback, context /*adtl args*/) {
    return this._registerEvent('after', topic, callback, context, Array.prototype.slice.call(arguments, 3));
  },

  once: function(topic, callback, context /*adtl args*/) {
    return this._registerEvent('once', topic, callback, context, Array.prototype.slice.call(arguments, 3));
  },

  _registerEvent: function(type, topic, callback, context, adtlArgs) {
    var listener = {
      callback: callback,
      context: context,
      adtlArgs: adtlArgs
    };

    if (!this.__topics[topic]) {
      this.__topics[topic] = {};
    }

    this.__topics[topic][type] = this.__topics[topic][type] || [];

    this.__topics[topic][type].push(listener);

  },

  fire: function(topic, defaultFn, adtlProperties) {
    var eventFacade = new Event(topic, this);
    if (Lang.isObject(adtlProperties)) {
      ObjectUtils.mix(eventFacade, adtlProperties);
    }

    this._dispatch('on', topic, eventFacade);
    this._dispatch('once', topic, eventFacade, true);

    if (!eventFacade.defaultPrevented) {
      if (Lang.isFunction(defaultFn)) {
        defaultFn();
      }

      this._dispatch('after', topic, eventFacade);
    }

  },

  _dispatch: function(type, topic, eventFacade, destroyAfterwards) {
    if (Lang.isObject(this.__topics[topic]) &&
     Lang.isArray(this.__topics[topic][type])) {

      var listeners = this.__topics[topic][type];
      listeners.forEach(function(listener) {
        var cbArgs = listener.adtlArgs.slice(0);
        cbArgs.splice(0, 0, eventFacade);

        if (Lang.isFunction(listener.callback)) {
          listener.callback.apply(listener.context, cbArgs);
        }
      });

      if (destroyAfterwards) {
        this.__topics[topic][type] = [];
      }
    }
  },


  detachAll: function() {
    delete this.__topics;
    this.__topics = {};
  }

  //NOTE: More mechanisms may be needed to prevent memory leaks. 
};

module.exports = EventTarget;