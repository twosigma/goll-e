var createClass = require('../utilities/createClass');
var Lang = require('../utilities/lang');

var ArrayList = createClass({
  instance: {
    _backing: [],
    add: function(el, index) {
      if (!Lang.isNumber(index)) {
        index = this._backing.length;
      }

      if (!this._validateValue(el)) {
        throw new Error('Invalid value');
      }

      this.fire('add', function() {
        this._backing.splice(index, 0, el);
      }.bind(this), {
        index: index,
        value: el
      });
    },

    remove: function(index) {
      if (index < 0 || index >= this.size()) {
        throw new Error('Index out of bounds.');
      }

      this.fire('remove', function() {
        this._backing.splice(index, 1);
      }.bind(this), {
        index: index,
        value: this._backing[index]
      });
    },

    toArray: function() {
      return this._backing.slice();
    },

    size: function() {
      return this._backing.length;
    },

    _validateValue: function(val) {
      return true;
    }
  }
});

module.exports = ArrayList;