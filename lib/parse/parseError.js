var createClass = require('../utilities/createClass');
var Lang = require('../utilities/lang');

var ParseError = createClass({

  attrs: {

    message: {
      value: '',
      validator: Lang.isString
    },

    lineNumber: {
      value: 0,
      validator: Lang.isNumber
    }
  }
});

module.exports = ParseError;
