var createClass = require('../../utilities/createClass');
var Lang = require('../../utilities/lang');

var Layout = createClass({

  attrs: {
    isPinned: {
      validator: Lang.isBoolean,
      value: false
    }
  }
});

module.exports = Layout;
