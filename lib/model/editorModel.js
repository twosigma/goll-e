var createClass = require('../utilities/createClass');
var Lang = require('../utilities/lang');
var gclParser = require('../../jison/gcl');
var gllParser = require('../../jison/gll');
var ContentModelFactory = require('./content/contentModelFactory');
var LayoutModelFactory = require('./layout/layoutModelFactory');
var generateGll = require('./layout/gllGenerator');
var LoadedStyles = require('./style/loadedStyles');
var autoLayout = require('../layout/forceDirectedLayout');

var EditorModel = createClass({

  instance: {

    /**
     * Stop listening to layout changes made to the graph.
     */
    _detachManualLayoutListener: function() {
      if (this._layoutChangedEventHandle) {
        this._layoutChangedEventHandle.detach();
      }
    },

    /**
     * Start listening to layout changes made to the graph, and update the GLL on any change in the manual layout.
     */
    _attachManualLayoutListener: function() {
      // TODO Pass in the moved element to _doAutomaticLayout. Also pass in whether the event was a pin, unpin, or move.
      var self = this;
      this._layoutChangedEventHandle = this.get('layout').on(['add', 'remove', 'update', 'change'], function(event) {
        // Generate GLL from the layout model and set layoutText.
        self.set('layoutText', generateGll(event.source));
      });
    },

    /**
     * Stop listening to the graph, then do the auto layout on it, then start
     * listening again.
     */
    _doAutomaticLayout: function() {
      // TODO Perform the layout starting with the moved element.

      // Detach the change listeners in preparation for automatic layout.
      this._detachManualLayoutListener();

      // Do the automatic layout.
      autoLayout(this.get('graph'));

      // Attach new listeners.
      this._attachManualLayoutListener();

    }
  },

  attrs: {

    contentText: {
      value: '',
      validator: Lang.isString,
      setter: function(val) {

        // Set the graph model if the parser made a new one.
        var newGraphModel = ContentModelFactory.build(gclParser.parse(val));
        if (newGraphModel !== null) {
          this._set('graph', newGraphModel);
        }

        return val;
      }
    },

    layoutText: {
      value: '',
      validator: Lang.isString,
      setter: function(val) {

        // Set the layout model if the parser made a new one.
        var newLayoutModel = LayoutModelFactory.build(gllParser.parse(val));
        if (newLayoutModel !== null) {
          this._set('layout', newLayoutModel);
        }

        return val;
      }
    },

    graph: {
      value: ContentModelFactory.build(gclParser.parse('')),
      setter: function(val) {
        this.get('graph').removeBubbleTarget(this);
        val.set('loadedLayout', this.get('layout'));
        val.set('loadedStyles', new LoadedStyles());
        val.addBubbleTarget(this);
        this._doAutomaticLayout();
        return val;
      }
    },

    layout: {
      value: LayoutModelFactory.build(gllParser.parse('')),
      setter: function(val) {
        this.get('graph').set('loadedLayout', val);
        this._doAutomaticLayout();
        return val;
      }
    }
  }
});

module.exports = EditorModel;
