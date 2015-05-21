var createClass = require('../utilities/createClass');
var ArrayList = require('./arrayList');

var ReroutePointsList = createClass({
  extend: ArrayList,

  constructor: function() {
    this.after('add', function(e) {
      e.value.addBubbleTarget(this);
    }, this);
    this.after('remove', function(e) {
      e.value.removeBubbleTarget(this);
    }, this);
  }
});

module.exports = ReroutePointsList;
