var createClass = require('../utilities/createClass');
var Lang = require('../utilities/lang');
var gclParser = require('../../jison/gcl');
var gllParser = require('../../jison/gll');
var ContentModelFactory = require('./content/contentModelFactory');
var LayoutModelFactory = require('./layout/layoutModelFactory');
var generateGll = require('./layout/gllGenerator');
var LoadedStyles = require('./style/loadedStyles');
var autoLayout = require('../layout/forceDirectedLayout');

var Reason = Object.freeze({
  MODEL_CHANGE: 'MODEL_CHANGE',
  TEXT_CHANGE: 'TEXT_CHANGE'
});

var EditorModel = createClass({

  constructor: function() {
    this._bindEvents();
  },

  instance: {

    _bindEvents: function() {
      this._bindManualLayoutListener();

      this.after('layoutChange', function(e) {
        if (this !== e.source) {
          return;
        }

        var graph = this.get('graph');
        graph.set('loadedLayout', e.newVal);
        autoLayout(graph);

        if (e.reason !== Reason.TEXT_CHANGE) {
          var newText = generateGll(this.get('layout'));
          this.set('layoutText', newText, {
            reason: Reason.MODEL_CHANGE
          });
        }

        this._bindManualLayoutListener();
      }, this);

      this.after('layoutTextChange', function(e) {
        // Don't rebuild the model if the text change was originated by a model change.
        if (this !== e.source || e.reason === Reason.MODEL_CHANGE) {
          return;
        }

        // Set the layout model if the parser made a new one.
        var newLayoutModel = LayoutModelFactory.build(gllParser.parse(e.newVal));
        if (newLayoutModel !== null) {
          this.set('layout', newLayoutModel, {
            reason: Reason.TEXT_CHANGE
          });
        }

      }, this);

      this.after('graphChange', function(e) {
        if (this !== e.source) {
          return;
        }

        e.prevVal.removeBubbleTarget(this);
        e.newVal.set('loadedLayout', this.get('layout'));
        e.newVal.set('loadedStyles', new LoadedStyles());
        e.newVal.addBubbleTarget(this);
        autoLayout(this.get('graph'));
      }, this);

      this.after('contentTextChange', function(e) {
        if (this !== e.source || e.reason === Reason.MODEL_CHANGE) {
          return;
        }

        // Set the graph model if the parser made a new one.
        var newGraphModel = ContentModelFactory.build(gclParser.parse(e.newVal));
        if (newGraphModel !== null) {
          this.set('graph', newGraphModel, {
            reason: Reason.TEXT_CHANGE
          });
        }
      }, this);

    },

    setLayoutText: function(newText) {
      this.set('layoutText', newText);

      var newLayoutModel = LayoutModelFactory.build(gllParser.parse(val));
      if (newLayoutModel !== null) {
        this._set('layout', newLayoutModel, {
          reason: Reason.TEXT_CHANGE
        });
      }
    },

    /**
     * Start listening to layout changes made to the graph, and update the GLL on any change in the manual layout.
     */
    _bindManualLayoutListener: function() {
      if (this._layoutChangedEventHandle) {
        this._layoutChangedEventHandle.detach();
      }

      this._layoutChangedEventHandle = this.get('layout').after(['remove', 'update', 'change'], function(event) {
        // Generate GLL from the layout model and set layoutText.
        var newText = generateGll(this.get('layout'));
        this.set('layoutText', newText, {
          reason: Reason.MODEL_CHANGE
        });
      }.bind(this));
    }
  },

  attrs: {

    contentText: {
      value: '',
      validator: Lang.isString
    },

    layoutText: {
      value: '',
      validator: Lang.isString
    },

    graph: {
      valueFn: function() {
        return ContentModelFactory.build(gclParser.parse(''));
      }
    },

    layout: {
      valueFn: function() {
        return LayoutModelFactory.build(gllParser.parse(''));
      }
    }
  }
});

module.exports = EditorModel;
