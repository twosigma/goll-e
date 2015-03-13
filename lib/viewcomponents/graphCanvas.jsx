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
    var activeGraph = this.state.navigationStack[this.state.navigationStack.length - 1];
    return (
      <div className="graph-canvas">
        <div className="navigation-controls">
          <button className="zoom-btn zoom-in" onClick={this._handleZoomInClick}>+</button>
          <button className="zoom-btn zoom-out" onClick={this._handleZoomOutClick}>&ndash;</button>
        </div>
        <Graph ref="graph" model={activeGraph} />
      </div>
    );
  },

  _handleZoomInClick: function() {
    this.refs.graph.zoom(0.5);
  },

  _handleZoomOutClick: function() {
    this.refs.graph.zoom(-0.5);
  }
});

module.exports = GraphCanvas;