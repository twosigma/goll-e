var React = require('react');
var GraphModel = require('./../model/graph');
var Graph = require('./graph.jsx');

var GraphCanvas = React.createClass({
  propType: {
    rootGraph: React.PropTypes.instanceOf(GraphModel)
  },

  getInitialState: function() {
    return {
      navigationStack: [this.props.rootGraph]
    };
  },

  render: function() {
    var activeGraph = this.state.navigationStack[this.state.navigationStack.length - 1];
    return (
      <Graph model={activeGraph} />
    );
  }
});

module.exports = GraphCanvas;