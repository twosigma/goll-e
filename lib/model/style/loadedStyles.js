var BubblingDictionary = require('../bubblingDictionary');
var Styles = require('./styles');

/**
 * A global singleton instance representing a map of all loaded styes keyed by gloabl id
 */
var loadedStyles = new BubblingDictionary({
  validCtor: Styles
});

module.exports = loadedStyles;
