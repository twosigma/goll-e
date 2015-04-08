var BubblingDictionary = require('../bubblingDictionary');
var Layout = require('./layout');

/**
 * A global singleton instance representing a map of all loaded layout data keyed by gloabl id
 */
var loadedLayout = new BubblingDictionary({
  validCtor: Layout
});

module.exports = loadedLayout;
