var Lang = require('./../utilities/lang');
var createClass = require('./../utilities/createClass');
var Styles = require('./styles');

var VertexStyles = createClass({
  extend: Styles,
  
  attrs: {
    width: {
      value: 150,
      validator: Lang.isNumber
    },

    height: {
      value: 94,
      validator: Lang.isNumber
    }

  }
});

module.exports = VertexStyles;