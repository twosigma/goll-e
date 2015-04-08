var ObjectUtils = require('./objects');
var Lang = require('./lang');
/**
 * A simple implementation of the observer pattern.
 * Mix me into your class with augment.
 * @class EventTarget
 * @constructor
 */
var EventTarget = function EventTarget() {
  this.__topics = {};
  this.__bubbleTargets = new Set();
  this.__nextId = 0;
};

/* a simple event facade */
var Event = function Event(topic, source) {
  this.defaultPrevented = false;
  this.propagationStopped = false;
  this.topic = topic;
  this.source = source;
};

var EventHandle = function(detachFn) {
  /* Constructor intended for internal use by EventTarget only */
  if (!Lang.isFunction(detachFn)) {
    throw new Error('detachFn must be a function');
  }
  this._detachFn = detachFn;
};

EventHandle.prototype.detach = function() {
  this._detachFn();
};

Event.prototype = {
  /**
   * Stop the default action from occuring if it has not yet executed.
   * @method preventDefault
   */
  preventDefault: function() {
    this.defaultPrevented = true;
  }
};

EventTarget.prototype = {

  isEventTarget: true,

  /**
   * Fired before the default function has occurred.
   * Call e.preventDefault() on the event and the action will be prevented.
   * @method on
   * @param  {String} topic event to listen to
   * @param  {Function} callback
   * @param  {Object} [context]
   * @param  {...any} [adtl] additional arguments can be provided and will be passed to the callback}
   * @returns {EventHandle} an object with a detach method
   */
  on: function(topic, callback, context /*adtl args*/) {
    return this._registerEvent('on', topic, callback, context, Array.prototype.slice.call(arguments, 3));
  },

  /**
   * Fired after the default function has occurred.
   * @method after
   * @param  {String} topic event to listen to
   * @param  {Function} callback
   * @param  {Object} [context]
   * @param  {...any} [adtl] additional arguments can be provided and will be passed to the callback}
   * @returns {EventHandle} an object with a detach method
   */
  after: function(topic, callback, context /*adtl args*/) {
    return this._registerEvent('after', topic, callback, context, Array.prototype.slice.call(arguments, 3));
  },

  // once: function(topic, callback, context /*adtl args*/) {
  //   return this._registerEvent('once', topic, callback, context, Array.prototype.slice.call(arguments, 3));
  // },

  _registerEvent: function(type, topic, callback, context, adtlArgs) {
    var detachFn;
    if (Lang.isArray(topic)) {
      var handles = topic.map(function(individualTopic) {
        return this._registerEvent(type, individualTopic, callback, context, adtlArgs);
      }, this);

      detachFn = function() {
        handles.forEach(function(handle) {
          handle.detach();
        });
      };
      return new EventHandle(detachFn);
    }

    var listener = {
      callback: callback,
      context: context,
      adtlArgs: adtlArgs
    };

    if (!this.__topics[topic]) {
      this.__topics[topic] = {};
    }

    if (!Lang.isObject(this.__topics[topic][type])) {
      this.__topics[topic][type] = {};
    }

    var id = this.__nextId++;

    this.__topics[topic][type][id] = listener;

    detachFn = function() {
      delete this.__topics[topic][type][id];
    }.bind(this);

    return new EventHandle(detachFn);
  },

  /**
   * Fire an event on this object.
   * @method fire
   * @param  {String} topic
   * @param  {Function} defaultFn a function that will be
   *   executed unless the default function was cancelled by a listener
   * @param  {Object} adtlProperties will be added to the event object
   */
  fire: function(topic, defaultFn, adtlProperties) {
    var eventFacade = new Event(topic, this);
    if (Lang.isObject(adtlProperties)) {
      ObjectUtils.mix(eventFacade, adtlProperties);
    }

    EventTarget._dispatch(this, 'on', topic, eventFacade);
    // EventTarget._dispatch('once', topic, eventFacade, true);

    if (!eventFacade.defaultPrevented) {
      if (Lang.isFunction(defaultFn)) {
        defaultFn();
      }

      EventTarget._dispatch(this, 'after', topic, eventFacade);
    }

  },

  /**
   * Bubble events up from this to eventTarget
   * eventTarget will receive all events of this.
   *
   * @method addBubbleTarget
   * @param {eventTarget} eventTarget the target to bubble to.
   */
  addBubbleTarget: function(eventTarget) {
    if (!eventTarget.isEventTarget) {
      throw new Error('Can only bubble to classes that augment EventTarget');
    }

    this.__bubbleTargets.add(eventTarget);
  },

  removeBubbleTarget: function(eventTarget) {
    return this.__bubbleTargets.delete(eventTarget);
  }

};


EventTarget._dispatch = function(eventTarget, type, topic, eventFacade, destroyAfterwards) {
  if (Lang.isObject(eventTarget.__topics[topic]) &&
   Lang.isObject(eventTarget.__topics[topic][type])) {

    var listeners = ObjectUtils.values(eventTarget.__topics[topic][type]);
    listeners.forEach(function(listener) {
      var cbArgs = listener.adtlArgs.slice(0);
      cbArgs.splice(0, 0, eventFacade);

      if (Lang.isFunction(listener.callback)) {
        listener.callback.apply(listener.context, cbArgs);
      }
    });

    if (destroyAfterwards) {
      eventTarget.__topics[topic][type] = [];
    }
  }

  eventTarget.__bubbleTargets.forEach(function(bubbleTarget) {
    EventTarget._dispatch(bubbleTarget, type, topic, eventFacade, destroyAfterwards);
  });
};

module.exports = EventTarget;
