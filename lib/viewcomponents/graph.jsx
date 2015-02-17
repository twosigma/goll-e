var React = require('react/addons');
var classSet = React.addons.classSet;
var mouseDownDrag = require('../utilities/mouseDownDrag');
var Node = require('./node.jsx');
 
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

         // For each node in the graph, create a node component.
        var nodeComponents = graph.get('nodes').map(function(node) {
            return (
                <Node
                    model={node}
                    key={node.get('globalId')}/>
            );
        }.bind(this));

        // Turn the pan and zoom properties into a transformation string.
        var transformation = 'translate(' + this.state.panX + ',' + this.state.panY + ') scale(' + this.state.zoom + ')';

        // Adding this class name changes the cursor style from hand to grabbing hand.
        var dragHandleClassName = classSet({
            'dragging_pan': this.state.dragging
        });

        // Put all of the node components in an SVG and a container for zooming and panning.
        return (
            <svg className="graph">

                {/* This rectangle forms a background and is a draggable handle for panning the view. */}
                <rect
                    className={dragHandleClassName}
                    id='pan_drag_handle'
                    x='0' y='0' width='100%' height='100%'
                    onMouseDown={mouseDownDrag.bind(this, 'pan', null, null, this._onPanPseudoDrag)} />
                <g id='zoom-container' transform={transformation}>
                    {nodeComponents}
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
