var createClass = require('./../utilities/createClass');
var AttrValidators = require('./../utilities/attrValidators');
var Lang = require('./../utilities/lang');
var Graph = require('./graph');
var parse = require('./../parse/parse');
var ParseError = require('./../parse/parseError');
var autoLayout = require('./../layout/dummyLayout');

var GCLEditorModel = createClass({

  constructor: function() {

    /**
     * Stop listening to layout changes made to the graph.
     */
    this._detachManualLayoutListeners = function() {
      if (this._positionChangedEventHandle) {
        this._positionChangedEventHandle.detach();
      }
      if (this._isPinnedChangedEventHandle) {
        this._isPinnedChangedEventHandle.detach();
      }
    }.bind(this);

    /**
     * Start listening to layout changes made to the graph, and perform
     * automatic layout each time there is one.
     */
    this._attachManualLayoutListeners = function(graph) {
      // TODO Pass in the moved element to _doAutomaticLayout. Also pass in whether the event was a pin, unpin, or move.
      this._positionChangedEventHandle = this.get('graph').after('positionChange', this._doAutomaticLayout);
      this._isPinnedChangedEventHandle = this.get('graph').after('isPinnedChange', this._doAutomaticLayout);
    }.bind(this);

    /**
     * Stop listening to the graph, then do the auto layout on it, then start
     * listening again.
     */
    this._doAutomaticLayout = function() {
      // TODO Perform the layout starting with the moved element.

      // Detach the change listeners in preparation for automatic layout.
      //this._detachManualLayoutListeners();

      // Do the automatic layout.
      autoLayout(this.get('graph'));

      // Attach new listeners.
      //this._attachManualLayoutListeners(this.get('graph'));

    }.bind(this);
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
        this._detachManualLayoutListeners();
        this._attachManualLayoutListeners(val);
        return val;
      }
    }
  }
});

module.exports = GCLEditorModel;
