var React = require('react');
var GraphModel = require('./../model/graph');
var Graph = require('./graph.jsx');

var AMOUNT = 0.25;

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
          <button className="zoom-btn zoom-actual" onClick={this._handleActualSize}>1&times;</button>
          <button className="zoom-btn zoom-out" onClick={this._zoomOutHanlderFn}>&ndash;</button>
          <button className="zoom-btn zoom-in" onClick={this._zoomInHanlderFn}>+</button>
        </div>
        <Graph ref="graph" model={this._getActiveGraph()} />
      </div>
    );
  },

  _getActiveGraph: function() {
    return this.state.navigationStack[this.state.navigationStack.length - 1];
  },

  _zoomOutHanlderFn: function(direction) {
    var graphView = this.refs.graph;
    graphView.scaleAboutCenter(graphView.state.scale + AMOUNT * -1);
  },

  _zoomInHanlderFn: function(direction) {
    var graphView = this.refs.graph;
    graphView.scaleAboutCenter(graphView.state.scale + AMOUNT);
  },

  _handleActualSize: function() {
    this.refs.graph.scaleAboutCenter(1);
  }
});

module.exports = GraphCanvas;
