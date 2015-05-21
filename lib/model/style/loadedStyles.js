var createClass = require('../../utilities/createClass');
var BubblingDictionary = require('../bubblingDictionary');
var Styles = require('./styles');

/**
 * A global singleton instance representing a map of all loaded styes keyed by gloabl id
 */
var loadedStyles = createClass({
  extend: BubblingDictionary,
  instance: {
    validCtor: Styles
  }
});

module.exports = loadedStyles;
