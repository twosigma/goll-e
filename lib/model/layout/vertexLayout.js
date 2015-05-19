var createClass = require('../../utilities/createClass');
var Lang = require('../../utilities/lang');
var Layout = require('./layout');

var VertexLayout = createClass({
  extend: Layout,
  attrs: {

    position: {
      value: {x: 0, y: 0},
      validator: function(val) {
        return 'x' in val && 'y' in val;
      },

      valueFn: function() {
        return {x: 0, y: 0};
      }
    }
  }
});

module.exports = VertexLayout;
