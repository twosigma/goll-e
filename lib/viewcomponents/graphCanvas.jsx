var React = require('react');
var GraphModel = require('../model/content/graph');
var Graph = require('./graph.jsx');

var ZOOM_BUTTON_AMOUNT = 0.25;
var SCROLL_SPEED = 0.0005;
var MIN_SCALE = 0.2;
var MAX_SCALE = 2.5;

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

    var colorBarColorStyles = {};
    if (activeVertex) {
      colorBarColorStyles.backgroundColor = activeVertex.getStyles().get('color');
    }
    var panAndZoom = this._getPanAndZoom(this._getActiveGraph());

    return (
      <div className='graph-canvas'>

        <div className='navigation-controls'>
          <button className='zoom-btn zoom-actual' onClick={this._actualSizeHandler}>1&times;</button>
          <button className='zoom-btn zoom-out' onClick={this._zoomOutHandler}>&ndash;</button>
          <button className='zoom-btn zoom-in' onClick={this._zoomInHandler}>+</button>
        </div>
        <div className='nav-bar'>

          <ol className='breadcrumbs'> {
            this.state.navigationStack.map(function(curGraph, i) {
              var isRoot = i === 0;
              var name = isRoot ? 'Root' : vertexStack[i].get('id');
              return (<li key={String(curGraph.get('globalId'))}><a onClick={function() {
                this.navigateTo(i);
              }.bind(this)}>{name}</a></li>);
            }, this)}
          </ol>

          <div className='color-bar' style={colorBarColorStyles} />
        </div>

        <Graph ref='graph'
          model={this._getActiveGraph()}
          scale={panAndZoom.scale}
          panX={panAndZoom.panX}
          panY={panAndZoom.panY}
          onDrag={this._onPanPseudoDrag}
          onWheel={this._handleWheel}
          openContainerCommand={this.pushGraph} />
      </div>
    );
  },

  pushGraph: function(vertex) {
    var newNavigationStack = this.state.navigationStack.slice();
    newNavigationStack.push(vertex.get('subGraph'));

    var newVertexStack = this.state.vertexStack.slice();
    newVertexStack.push(vertex);

    this.setState({
      navigationStack: newNavigationStack,
      vertexStack: newVertexStack
    });
  },

  navigateTo: function(stackPos) {
    if (stackPos < 0 || stackPos >= this.state.navigationStack.length) {
      throw new Error('Navigation stack index out of bounds.');
    }

    this.setState({
      navigationStack: this.state.navigationStack.slice(0, stackPos + 1),
      vertexStack: this.state.vertexStack.slice(0, stackPos + 1)
    });
  },

  _getActiveGraph: function() {
    return this.state.navigationStack[this.state.navigationStack.length - 1];
  },

  _getPanAndZoom: function(graph) {
    var graphId = graph.get('globalId');
    return this.state.savedPanAndZoom[graphId] || {
      panX: 0,
      panY: 0,
      scale: 1.0
    };
  },

  _onPanPseudoDrag: function(event) {
    var graphId = this._getActiveGraph().get('globalId');

    var newPanAndZoom = this._getPanAndZoom(this._getActiveGraph());
    newPanAndZoom.panX += event.movementX;
    newPanAndZoom.panY += event.movementY;

    var savedPanAndZoom = this.state.savedPanAndZoom;
    savedPanAndZoom[graphId] = newPanAndZoom;

    this.setState({
      savedPanAndZoom: savedPanAndZoom
    });
  },

  _zoomOutHandler: function() {
    var panAndZoom = this._getPanAndZoom(this._getActiveGraph());
    this.scaleAboutCenter(panAndZoom.scale + ZOOM_BUTTON_AMOUNT * -1);
  },

  _zoomInHandler: function() {
    var panAndZoom = this._getPanAndZoom(this._getActiveGraph());
    this.scaleAboutCenter(panAndZoom.scale + ZOOM_BUTTON_AMOUNT);
  },

  _actualSizeHandler: function() {
    this.scaleAboutCenter(1);
  },

  _handleWheel: function(e) {
    e.preventDefault();
    var panAndZoom = this._getPanAndZoom(this._getActiveGraph());
    var newScale = panAndZoom.scale + (-e.deltaY * SCROLL_SPEED);

    this.scale(newScale, e.clientX, e.clientY);

  },

  /**
   * Set a new scaling factor about a point
   * @method scale
   * @param  {Number} newScale new scale factor
   * @param  {Number} aboutX point in client coordinates
   * @param  {Number} aboutY point in client coordinates
   */
  scale: function(newScale, aboutX, aboutY) {
    var graphId = this._getActiveGraph().get('globalId');
    var panAndZoom = this._getPanAndZoom(this._getActiveGraph());

    // limit zoom
    if (newScale < MIN_SCALE) {
      newScale = MIN_SCALE;
    } else if (newScale > MAX_SCALE) {
      newScale = MAX_SCALE;
    }

    // scale about a point
    var scaleDelta = newScale / panAndZoom.scale;

    panAndZoom.panX = scaleDelta * (panAndZoom.panX - aboutX) + aboutX;
    panAndZoom.panY = scaleDelta * (panAndZoom.panY - aboutY) + aboutY;
    panAndZoom.scale = newScale;

    var savedPanAndZoom = this.state.savedPanAndZoom;
    savedPanAndZoom[graphId] = panAndZoom;

    this.setState({
      savedPanAndZoom: savedPanAndZoom
    });
  },

  /**
   * Increase scale about center
   * @method zoom
   * @param  {Number} newScale New scale factor.
   */
  scaleAboutCenter: function(newScale) {
    // Scale about center
    var svg = this.refs.graph.getDOMNode();
    this.scale(newScale, svg.offsetWidth / 2, svg.offsetHeight / 2);
  }

});

module.exports = GraphCanvas;
