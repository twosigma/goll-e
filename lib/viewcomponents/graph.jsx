var React = require('react/addons');
var classSet = React.addons.classSet;
var mouseDownDrag = require('../utilities/mouseDownDrag');
var Vertex = require('./vertex.jsx');
var Edge = require('./edge.jsx');
var edgeGlobals = require('./edgeGlobals');

var SCROLL_SPEED = 0.0005;
var MIN_SCALE = 0.2;
var MAX_SCALE = 2.5;
 
/**
 * Graph is a component that shows a graph based on a given data model.
 */
var Graph = React.createClass({

  getInitialState: function() {
    return {
      panX: 0,
      panY: 0,
      scale: 1.0
    };
  },

  render: function() {
    var graph = this.props.model;

    var bgPatternSize = 26;

    // For each vertex in the graph, create a vertex component.
    var vertexComponents = graph.get('vertices').map(function(vertex) {
      return (
        <Vertex
          model={vertex}
          key={vertex.get('globalId')} />
        );
    }.bind(this));

    var edgeComponents = graph.get('edges').map(function(edge) {
      return (
        <Edge
          model={edge}
          container={graph}
          key={edge.get('globalId')}/>
      );
    }.bind(this));

    // Turn the pan and zoom properties into a transformation string.
    var transformation = 'translate(' + this.state.panX + ',' + this.state.panY + ') scale(' + this.state.scale + ')';

    var bgSize = '' + (120/this.state.scale) + '%';
    var bgTransform = 'translate(' + (this.state.panX % bgPatternSize - bgPatternSize) + 
      ',' + (this.state.panY % bgPatternSize - bgPatternSize) + ') scale(' + this.state.scale + ')';

    // Put all of the vertex components in an SVG and a container for zooming and panning.
    return (
      <svg className="graph" onWheel={this._handleWheel}>
        <defs dangerouslySetInnerHTML={{__html: edgeGlobals}} />
        {/* define the background image pattern */}
        <defs>
          <pattern id="background-pattern" width={bgPatternSize} height={bgPatternSize} patternUnits="userSpaceOnUse" dangerouslySetInnerHTML={{__html: 
            '<image x="0" y="0" width="' + bgPatternSize + '" height="' + bgPatternSize + '" xlink:href="/images/tiny_grid.png"></image>'
          }}>
          </pattern>
        </defs>

        {/* This rectangle forms a background and is a draggable handle for panning the view. */}
        {/* It moves graphPan % patternSize to give the illusion of dragging the background */}
        <rect
          className='drag-handle'
          fill="url(#background-pattern)"
          transform={bgTransform} 
          width={bgSize} height={bgSize}
          onMouseDown={mouseDownDrag.bind(this, 'pan', null, null, this._onPanPseudoDrag)} />
        <g id='zoom-container' transform={transformation}>
          {edgeComponents}
          {vertexComponents}
        </g>
      </svg>
    );
  },

  _onPanPseudoDrag: function(event) {
    var oldPanX = this.state.panX;
    var oldPanY = this.state.panY;
    var newPanX = oldPanX + event.movementX;
    var newPanY = oldPanY + event.movementY;
    this.setState({
      panX: newPanX,
      panY: newPanY
    });
  },

  _handleWheel: function(e) {
    e.preventDefault();
    var newScale = this.state.scale + (-e.deltaY * SCROLL_SPEED);

    this.scale(newScale, e.clientX, e.clientY);

  },

  scale: function(newScale, aboutX, aboutY) {
    // limit zoom
    if (newScale < MIN_SCALE) {
      newScale = MIN_SCALE;
    } else if (newScale > MAX_SCALE) {
      newScale = MAX_SCALE;
    }

    // scale about a point
    var scaleDelta = newScale / this.state.scale;

    var x = scaleDelta * (this.state.panX - aboutX) + aboutX;
    var y = scaleDelta * (this.state.panY - aboutY) + aboutY;

    this.setState({
      scale: newScale,
      panX: x,
      panY: y
    });
  },

  zoomIn: function() {
    this.setState({
      scale: this.state.scale + 0.003
    });
  }

});

module.exports = Graph;
