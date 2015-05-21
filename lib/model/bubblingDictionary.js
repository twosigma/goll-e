var createClass = require('../utilities/createClass');
var Dictionary = require('./dictionary');

/**
 * A Dictionary that binds itself as a bubble target to any event targets put in it.
 *
 * Remember, that means that events that this emits may have bubbled up.
 * To see if it is a event origining from this dictionary, test event.source === myBubblingDic
 */

var BubblingDictionary = createClass({
  extend: Dictionary,
  constructor: function() {
    this._bindBubbling();
  },
  instance: {
    _bindBubbling: function() {
      var bindValue = function(value) {
        if (value && value.isEventTarget) {
          value.addBubbleTarget(this);
        }
      }.bind(this);

      var unbindValue = function(value) {
        if (value && value.isEventTarget) {
          value.removeBubbleTarget(this);
        }
      }.bind(this);

      this.after(['add', 'update'], function(e) {
        if (e.source !== this) {
          return;
        }
        unbindValue(e.prevVal);
        bindValue(e.value);
      }, this);

      this.after('remove', function(e) {
        if (e.source !== this) {
          return;
        }
        unbindValue(e.value);
      }, this);
    }
  }
});

module.exports = BubblingDictionary;
