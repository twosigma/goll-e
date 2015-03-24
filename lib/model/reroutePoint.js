var createClass = require('../utilities/createClass');
var Lang = require('../utilities/lang');

var ReroutePoint = createClass({
  instance: {
    getScaled: function(sourcePos, targetPos) {
      return {
        x: (targetPos.x + sourcePos.x)/2 + this.get('x'),
        y: (targetPos.y + sourcePos.y)/2 + this.get('y')
      };
    }
  },

  attrs: {
    x: {
      validator: Lang.isNumber,
      value: 0
    },

    y: {
      validator: Lang.isNumber,
      value: 0
    }
  }
});

module.exports = ReroutePoint;