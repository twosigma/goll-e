var createClass = require('./createClass');

var QuadNode = createClass({
  attrs: {
    value: {
      value: null,
      initOnly: true
    },

    boundingBox: {
      validator: function(val) {
        return 'x' in val && 'y' in val && 'width' in val && 'height' in val;
      },
      initOnly: true
    }
  }
});

module.exports = QuadNode;
