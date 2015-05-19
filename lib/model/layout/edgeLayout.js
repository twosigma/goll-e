var createClass = require('../../utilities/createClass');
var ReroutePointsList = require('./reroutePointsList');
var AttrValidators = require('../../utilities/attrValidators');
var Layout = require('./layout');

var EdgeLayout = createClass({
  extend: Layout,
  instance: {
    _bindReroutePointsChange: function(list) {
      list.after(['add', 'remove'], function() {
        this.fire('change');
      }, this);
      list.addBubbleTarget(this);
      return list;
    }
  },

  attrs: {
    reroutePoints: {
      validator: AttrValidators.isInstanceOf(ReroutePointsList),
      initOnly: true,
      valueFn: function() {
        var list = new ReroutePointsList();
        this._bindReroutePointsChange(list);
        return list;
      },
      setter: '_bindReroutePointsChange'
    },

    isPinned: {
      getter: function() {
        return this.get('reroutePoints').size() > 0;
      },

      setter: function(val) {
        if (val === false) {
          var reroutePoints = this.get('reroutePoints');
          for (var i = reroutePoints.size() - 1; i >= 0; i--) {
            reroutePoints.remove(i);
          }
        }
        return val;
      }
    }
  }
});

module.exports = EdgeLayout;
