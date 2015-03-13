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

  componentWillReceiveProps: function(nextProps) {
    if (this.state.navigationStack[0] !== nextProps.rootGraph) {
      this.setState({
        navigationStack: [nextProps.rootGraph]
      });
    }
  },

  render: function() {
    return (
      <div className="graph-canvas">
        <div className="navigation-controls">
          <button className="zoom-btn zoom-in" onClick={this._getZoomHanderFn(1)}>+</button>
          <button className="zoom-btn zoom-out" onClick={this._getZoomHanderFn(-1)}>&ndash;</button>
        </div>
        <Graph ref="graph" model={this._getActiveGraph()} />
      </div>
    );
  },

  _getActiveGraph: function() {
    return this.state.navigationStack[this.state.navigationStack.length - 1];
  },

  _getZoomHanderFn: function(direction) {
    var AMOUNT = 0.25;
    return function() {
      var graphView = this.refs.graph;
      graphView.scaleAboutCenter(graphView.state.scale + 0.5 * direction);
    }.bind(this);
  }
});

module.exports = GraphCanvas;