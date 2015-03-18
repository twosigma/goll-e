var React = require('react/addons');
var Lang = require('../utilities/lang');
var mouseDownDrag = require('../utilities/mouseDownDrag');
var Vertex = require('./vertex.jsx');
var Edge = require('./edge.jsx');
var edgeGlobals = require('./edgeGlobals');


/**
 * Graph is a component that shows a graph based on a given data model.
 */
var Graph = React.createClass({


  getDefaultProps: function() {
    return {
      panX: 0,
      panY: 0,
      scale: 1.0
    };
  },

  render: function() {
    var graph = this.props.model;

    var bgPatternSize = 26;
    var effectiveBgPatternSize = bgPatternSize * this.props.scale;

    // For each vertex in the graph, create a vertex component.
    var vertexComponents = graph.get('vertices').map(function(vertex) {
      return (
        <Vertex
          model={vertex}
          key={vertex.get('globalId')}
          zoomScale={this.props.scale}
          openContainerCommand={this.props.openContainerCommand} />
        );
    }.bind(this));

    var edgeComponents = graph.get('edges').map(function(edge) {
      return (
        <Edge
          model={edge}
          container={graph}
          key={edge.get('globalId')}
          zoomScale={this.props.scale} />
      );
    }.bind(this));

    // Turn the pan and zoom properties into a transformation string.
    var transformation = 'translate(' + this.props.panX + ',' + this.props.panY + ') scale(' + this.props.scale + ')';

    var bgSize = '' + (120 / this.props.scale) + '%';
    var bgTransform = 'translate(' + (this.props.panX % effectiveBgPatternSize - effectiveBgPatternSize) +
      ',' + (this.props.panY % effectiveBgPatternSize - effectiveBgPatternSize) + ') scale(' + this.props.scale + ')';

    // Put all of the vertex components in an SVG and a container for zooming and panning.
    return (
      <svg className="graph" onWheel={this.props.onWheel} ref="svg">
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
          className='drag-handle background'
          fill="url(#background-pattern)"
          transform={bgTransform}
          width={bgSize} height={bgSize}
          onMouseDown={mouseDownDrag.bind(this, 'pan', null, null, this.props.onDrag, 1)} />
        <g id='zoom-container' transform={transformation}>
          {edgeComponents}
          {vertexComponents}
        </g>
      </svg>
    );
  }

});

module.exports = Graph;
