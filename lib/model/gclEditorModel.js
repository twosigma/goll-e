var createClass = require('./../utilities/createClass');
var AttrValidators = require('./../utilities/attrValidators');
var Lang = require('./../utilities/lang');
var Graph = require('./graph');
var Parse = require('./parse/parse');
var ParseError = require('./parse/parseError');

var GCLEditorModel = createClass({

  constructor: function(config) {
    this._graphIsPinnedChangeEventHandle = null;
    this._graphPositionChangeEventHandle = null;
  },

  attrs: {

    text: {
      value: '',
      validator: Lang.isString,
      setter: function(val) {
        var parseResult = Parse(val);

        // Set the graph model if the parser made a new one.
        var newGraphModel = parseResult.model;
        if (newGraphModel !== null) {
          this._set('graph', newGraphModel);
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
      value: new Graph({vertices: [], edges:[]}),
      setter: function(val) {

        // Detach the listeners for isPinned and position from the old graph and reattach them to the new graph.
        if (this._graphisPinnedChangeEventHandle !== null) {
          this._graphIsPinnedChangeEventHandle.detach();
        }
        this._graphIsPinnedChangeEventHandle = val.after('isPinnedChange', this._onIsPinnedChange);
        if (this._graphPositionChangeEventHandle !== null) {
          this._graphPositionChangeEventHandle.detach();
        }
        this._graphPositionChangeEventHandle = val.after('positionChange', this._onPositionChange);

        return val;
      }
    }
  }
});

module.exports = GCLEditorModel;
