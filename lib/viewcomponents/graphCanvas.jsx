var React = require('react');
var GraphModel = require('./../model/graph');
var Graph = require('./graph.jsx');
var ObjectUtils = require('../utilities/objects');

// Singleton
var GraphCanvas = React.createClass({
  propType: {
    rootGraph: React.PropTypes.instanceOf(GraphModel)
  },

  getInitialState: function() {
    return {
      navigationStack: [this.props.rootGraph],
      vertexStack: [null],
      savedPanAndZoom: {}
    };
  },

  componentWillReceiveProps: function(nextProps) {
    if (this.state.navigationStack[0] !== nextProps.rootGraph) {
      this.setState({
        navigationStack: [nextProps.rootGraph],
        vertexStack: [null] // a parrallel array of the containing vertex
      });
    }
  },

  render: function() {
    var vertexStack = this.state.vertexStack;
    var activeVertex = vertexStack[vertexStack.length - 1];
    var activeGraph = this.state.navigationStack[this.state.navigationStack.length - 1];
    var graphId = activeGraph.get('globalId');

    var colorBarColorStyles = {};
    if (activeVertex) {
      colorBarColorStyles.backgroundColor = activeVertex.get('styles').get('color');
    }

    return (
      <div className="graph-canvas">

        <div className="navigation-controls">
          <button className="zoom-btn zoom-actual" onClick={this._handleActualSize}>1&times;</button>
          <button className="zoom-btn zoom-out" onClick={this._getZoomHanderFn(-1)}>&ndash;</button>
          <button className="zoom-btn zoom-in" onClick={this._getZoomHanderFn(1)}>+</button>
        </div>

        <div className="nav-bar">

          <ol className="breadcrumbs"> {
            this.state.navigationStack.map(function(curGraph, i) {
              var isRoot = i === 0;
              var name = isRoot ? 'Root' : vertexStack[i].get('id');
              return (<li key={String(curGraph.get('globalId'))}><a onClick={function() {
                this.navigateTo(i);
              }.bind(this)}>{name}</a></li>);
            }, this)}
          </ol>

          <div className="color-bar" style={colorBarColorStyles} />
        </div>

        <Graph key={graphId} ref="graph" model={activeGraph} openContainerCommand={this.pushGraph}
        initialPanAndZoom={this.state.savedPanAndZoom[graphId]}/>

      </div>
    );
  },

  _getZoomHanderFn: function(direction) {
    var AMOUNT = 0.25;
    return function() {
      var graphView = this.refs.graph;
      graphView.scaleAboutCenter(graphView.state.scale + AMOUNT * direction);
    }.bind(this);
  },

  _handleActualSize: function() {
    this.refs.graph.scaleAboutCenter(1);
  },

  pushGraph: function(vertex) {
    this.savePanAndZoom();

    var newNavigationStack = this.state.navigationStack.slice();
    newNavigationStack.push(vertex.get('subGraph'));

    var newVertexStack = this.state.vertexStack.slice();
    newVertexStack.push(vertex);

    this.setState({
      navigationStack: newNavigationStack,
      vertexStack: newVertexStack
    });
  },

  savePanAndZoom: function() {
    var newSavedPanAndZoom = ObjectUtils.merge(this.state.savedPanAndZoom);
    var currentGraphView = this.refs.graph;

    newSavedPanAndZoom[currentGraphView.props.model.get('globalId')] = {
      panX: currentGraphView.state.panX,
      panY: currentGraphView.state.panY,
      scale: currentGraphView.state.scale
    };

    this.setState({
      savedPanAndZoom: newSavedPanAndZoom
    });
  },

  navigateTo: function(stackPos) {
    if (stackPos < 0 || stackPos >= this.state.navigationStack.length) {
      throw new Error('Navigation stack index out of bounds.');
    }

    this.savePanAndZoom();

    this.setState({
      navigationStack: this.state.navigationStack.slice(0, stackPos + 1),
      vertexStack: this.state.vertexStack.slice(0, stackPos + 1)
    });
  }
});

module.exports = GraphCanvas;
