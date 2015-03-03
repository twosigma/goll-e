var createClass = require('./../utilities/createClass');
var AttrValidators = require('./../utilities/attrValidators');
var Lang = require('./../utilities/lang');
var Graph = require('./graph');
var Parse = require('./../parse/parse');
var ParseError = require('./../parse/parseError');

var GCLEditorModel = createClass({

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
        this.get('graph').removeBubbleTarget(this);
        val.addBubbleTarget(this);
        return val;
      }
    }
  }
});

module.exports = GCLEditorModel;
