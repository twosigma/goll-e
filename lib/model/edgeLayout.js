var createClass = require('../utilities/createClass');
var ReroutePointsList = require('./reroutePointsList');
var AttrValidators = require('./../utilities/attrValidators');

var EdgeLayout = createClass({
  instance: {
    _bindReroutePointsChange: function(list) {
      list.after(['add', 'remove'], function(e) {
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
    }
  }
});

module.exports = EdgeLayout;