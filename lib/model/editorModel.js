var createClass = require('../utilities/createClass');
var Lang = require('../utilities/lang');
var Graph = require('./content/graph');
var gclParser = require('../../jison/gcl');
var gllParser = require('../../jison/gll');
var contentModelFactory = require('./content/contentModelFactory');
var LayoutModelFactory = require('./layout/layoutModelFactory');
var autoLayout = require('../../layout/forceDirectedLayout');

var loadedLayout = require('../layout/loadedLayout');

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
     * Start listening to layout changes made to the graph, and perform
     * automatic layout each time there is one.
     * @param {Layout} layout the graph to which to listen
     */
    _attachManualLayoutListener: function() {
      // TODO Pass in the moved element to _doAutomaticLayout. Also pass in whether the event was a pin, unpin, or move.
      var self = this;
      this._layoutChangedEventHandle = this.get('loadedLayout').after(['positionChange', 'isPinnedChange'], function() {
        self._doAutomaticLayout();
        // TODO Generate GLL from the layout model and set layoutText.
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
      this._attachManualLayoutListener(this.get('graph'));

    }
  },

  attrs: {

    contentText: {
      value: '',
      validator: Lang.isString,
      setter: function(val) {

        // Set the graph model if the parser made a new one.
        var newGraphModel = contentModelFactory.build(gclParser.parse(val));
        if (newGraphModel !== null) {
          this._set('graph', newGraphModel);
          this._doAutomaticLayout();
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
      value: contentModelFactory.build(gclParser.parse('')),
      setter: function(val) {
        this.get('graph').removeBubbleTarget(this);
        val.addBubbleTarget(this);
        val.set('loadedLayout', this.get('layout'));
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
