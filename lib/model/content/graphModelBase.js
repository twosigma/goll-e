var Lang = require('../../utilities/lang');
var ObjectUtils = require('../../utilities/objects');
var createClass = require('../../utilities/createClass');

var Styles = require('../style/styles');
var Layout = require('../layout/layout');

var SCOPE_SYMBOLS = {
  NODE: '>',
  INPUT: '+',
  OUTPUT: '-'
};

var INVALID_ID_CHARS = ObjectUtils.values(SCOPE_SYMBOLS);

// Validate scoped id
var validateId = function(id) {
  if (!Lang.isValue(id)) {
    console.warn('Id must be defined');
  }

  if (!(Lang.isString(id) || Lang.isNumber(id))) {
    console.warn('Id must be a string or number');
    return false;
  }

  INVALID_ID_CHARS.forEach(function(invalidChar) {
    if (String(id).indexOf(invalidChar) !== -1) {
      console.warn('Id cannot contain "' + invalidChar + '"');
      return false;
    }
  });

  return true;
};

/**
 * A base class for the content Model for the graph
 * @attribute instance
 * @type      [type]
 */
var GraphModelBase = createClass({

  constructor: function() {
    this.after('loadedLayoutChange', function(e) {
      if (e.source !== this) {
        return;
      }
      this.getChildren().forEach(function(child) {
        child.set('loadedLayout', e.newVal);
      });
    }, this);

    this.after('loadedStylesChange', function(e) {
      if (e.source !== this) {
        return;
      }
      this.getChildren().forEach(function(child) {
        child.set('loadedStyles', e.newVal);
      });
    }, this);
  },

  instance: {
    getStyles: function() {
      var id = this.get('globalId');
      var StyleClass = this.constructor.STYLE_CLASS;

      var loadedStyles = this.get('loadedStyles');

      if (loadedStyles.hasKey(id)) {
        var styles = loadedStyles.fetch(id);
        if (!(styles instanceof StyleClass)) {
          throw new Error('Loaded styles do not match type of content model.');
        }
        return styles;

      } else {
        var defaults = new StyleClass();
        loadedStyles.put(id, defaults);
        return defaults;
      }
    },

    getLayout: function() {
      var id = this.get('globalId');
      var LayoutClass = this.constructor.LAYOUT_CLASS;

      var loadedLayout = this.get('loadedLayout');

      if (loadedLayout.hasKey(id)) {
        var layout = loadedLayout.fetch(id);
        if (!(layout instanceof LayoutClass)) {
          throw new Error('Loaded layout data does not match type of content model.');
        }
        return layout;

      } else {
        var defaults = new LayoutClass();
        loadedLayout.put(id, defaults);
        return defaults;
      }
    },

    // Get child models
    getChildren: function() {
      return [];
    }
  },

  attrs: {

    /**
     * A scoped id string for this object
     * @attribute id
     * @type {String|Number}
     * @initOnly
     */
    id: {
      validator: validateId,
      initOnly: true
    },

    /**
     * A globally unique identifier in this Graph
     * @attribute globalId
     * @type {String}
     * @initOnly
     */
    globalId: {
      validator: Lang.isString,
      initOnly: true
    },

    loadedLayout: {

    },

    loadedStyles: {

    }
  },

  statics: {
    // should be overridden!!
    STYLE_CLASS: Styles,
    LAYOUT_CLASS: Layout
  }
});

module.exports = GraphModelBase;
