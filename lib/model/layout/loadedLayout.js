var createClass = require('../../utilities/createClass');
var BubblingDictionary = require('../bubblingDictionary');
var Layout = require('./layout');

/**
 * A map of loaded layout data keyed by gloabl id.
 */
var LoadedLayout = createClass({
  extend: BubblingDictionary,
  instance: {
    validCtor: Layout
  }
});

module.exports = LoadedLayout;
