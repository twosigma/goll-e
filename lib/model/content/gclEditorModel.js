var createClass = require('./../../utilities/createClass');
var AttrValidators = require('./../../utilities/attrValidators');
var Lang = require('./../../utilities/lang');
var Graph = require('./graph');
var parse = require('./../../parse/parse');
var ParseError = require('./../../parse/parseError');
var autoLayout = require('./../../layout/forceDirectedLayout');

var loadedLayout = require('../layout/loadedLayout');

var GCLEditorModel = createClass({

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
     * @param {Graph} graph the graph to which to listen
     */
    _attachManualLayoutListener: function(graph) {
      // TODO Pass in the moved element to _doAutomaticLayout. Also pass in whether the event was a pin, unpin, or move.
      this._layoutChangedEventHandle = loadedLayout.after(['positionChange', 'isPinnedChange'], this._doAutomaticLayout.bind(this));
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

    text: {
      value: '',
      validator: Lang.isString,
      setter: function(val) {
        var parseResult = parse(val);

        // Set the graph model if the parser made a new one.
        var newGraphModel = parseResult.model;
        if (newGraphModel !== null) {
          this._set('graph', newGraphModel);
          this._doAutomaticLayout();
        }

        this._set('errors', parseResult.gclErrors);

        return val;
      }
    },

    errors: {
      value: [],
      validator: AttrValidators.isArrayOf(ParseError)
    },

    graph: {
      value: new Graph({vertices: [], edges: []}),
      setter: function(val) {
        this.get('graph').removeBubbleTarget(this);
        val.addBubbleTarget(this);
        return val;
      }
    }
  }
});

module.exports = GCLEditorModel;
