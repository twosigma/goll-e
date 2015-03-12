var React = require('react/addons');
var classSet = React.addons.classSet;
var mouseDownDrag = require('../utilities/mouseDownDrag');
var Vertex = require('./vertex.jsx');
var Edge = require('./edge.jsx');
var edgeGlobals = require('./edgeGlobals');
 
/**
 * Graph is a component that shows a graph based on a given data model.
 */
var Graph = React.createClass({

  getInitialState: function() {
    return {
      panX: 0,
      panY: 0,
      zoom: 1.0
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
    var transformation = 'translate(' + this.state.panX + ',' + this.state.panY + ') scale(' + this.state.zoom + ')';

    // Adding this class name changes the cursor style from hand to grabbing hand.
    var dragHandleClassName = classSet({
      'dragging_pan': this.state.dragging
    });

    // Put all of the vertex components in an SVG and a container for zooming and panning.
    return (
      <svg className="graph">
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
          className={dragHandleClassName}
          id='pan_drag_handle'
          fill="url(#background-pattern)"
          transform={'translate(' + (this.state.panX % bgPatternSize - bgPatternSize) + ',' + (this.state.panY % bgPatternSize - bgPatternSize) + ')'} width='150%' height='150%'
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
  }

});

module.exports = Graph;
