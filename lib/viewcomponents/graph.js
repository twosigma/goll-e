var React = require('react/addons');
var classSet = React.addons.classSet;
var SVGDraggableMixin = require('../mixins/svgDraggableMixin');
var Node = require('./node');
 
/**
 * Graph is a component that shows a graph based on a given data model.
 */
var Graph = React.createClass({

    mixins: [SVGDraggableMixin],

    getInitialState: function() {
        return {
            panX: 0,
            panY: 0,
            zoom: 1.0
        };
    },

    render: function() {
        var data = this.props.model.getAST();

         // For each element of data.nodes, create a node component.
        var nodeComponents = data.nodes.map(function(nodeData) {
            return (
                <Node
                    id={nodeData.id}
                    key={nodeData.id}
                    x={nodeData.x}
                    y={nodeData.y}
                    label={nodeData.label}
                    model={this.props.model} />
            );
        }.bind(this));

        // Turn the pan and zoom properties into a transformation string.
        var transformation = 'translate(' + this.state.panX + ',' + this.state.panY + ') scale(' + this.state.zoom + ')';

        // Adding this class name changes the cursor style from hand to grabbing hand.
        var dragHandleClassName = classSet({
            'dragging': this.state.dragging
        });

        // Put all of the node components in an SVG and a container for zooming and panning.
        return (
            <svg>
                {/* This rectangle forms a background and is a draggable handle for panning the view. */}
                <rect
                    className={dragHandleClassName}
                    id='pan_drag_handle'
                    x='0' y='0' width='100%' height='100%'
                    ref='pan_drag_handle' />
                <g id='zoom-container' transform={transformation}>
                    {nodeComponents}
                </g>
            </svg>
        );
    },

    _getDraggableRef: function() {
        return this.refs['pan_drag_handle'];
    },

    _onDrag: function(event) {
        var oldPanX = this.state.panX;
        var oldPanY = this.state.panY;
        var newPanX = oldPanX + event.deltaX;
        var newPanY = oldPanY + event.deltaY;
        this.setState({
            panX: newPanX,
            panY: newPanY
        });
    }

});

module.exports = Graph;
