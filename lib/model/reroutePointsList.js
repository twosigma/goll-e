var createClass = require('../utilities/createClass');
var ArrayList = require('./arrayList');

var ReroutePointsList = createClass({
  constructor: function() {
    this.after('add', function(e) {
      e.value.addBubbleTarget(this);
    }, this);
    this.after('remove', function(e) {
      e.value.removeBubbleTarget(this);
    }, this);
  },

  extend: ArrayList
});

module.exports = ReroutePointsList;
