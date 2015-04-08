var Dictionary = require('../dictionary');
var Layout = require('./layout');

/**
 * A global singleton instance representing a map of all loaded layout data keyed by gloabl id
 */
var loadedLayout = new Dictionary({
  validCtor: Layout
});

module.exports = loadedLayout;
