var React = require('react/addons');
var classSet = React.addons.classSet;
var Node = require('./node');
 
/**
 * Graph is a component that shows a graph based on a given data model.
 */
var Graph = React.createClass({

    getInitialState: function() {
        return {
            panX: 0,
            panY: 0,
            zoom: 1.0,
            dragging: false
        };
    },

    render: function() {

         // For each element of data.nodes, create a node component.
        var nodeComponents = this.props.data.nodes.map(function(nodeData) {
            return (
                <Node
                    id={nodeData.id}
                    key={nodeData.id}
                    x={nodeData.x}
                    y={nodeData.y}
                    label={nodeData.label} />
            );
        });

        // Turn the pan and zoom properties into a transformation string.
        var transformation = 'translate(' + this.state.panX + ',' + this.state.panY + ') scale(' + this.state.zoom + ')';

        var dragHandleClassName = classSet({
            'dragging': this.state.dragging
        });

        // Put all of the node components in an SVG and a container for zooming and panning.
        return (
            <svg>
                {/* This rectangle forms a background and is a draggable handle for panning the view. */}
                <rect
                    draggable
                    className={dragHandleClassName}
                    id='pan_drag_handle'
                    x='0' y='0' width='100%' height='100%'
                    onMouseDown={this._onMouseDown}
                    onMouseMove={this._onMouseMove}
                    onMouseUp={this._onMouseUp} />
                <g id='zoom-container' transform={transformation}>
                    {nodeComponents}
                </g>
            </svg>
        );
    },

    _onMouseDown: function(event) {
        var newDragX = event.clientX;
        var newDragY = event.clientY;
        this.setState({
            dragX: newDragX,
            dragY: newDragY,
            dragging: true
        });
    },

    _onMouseMove: function(event) {
        if (this.state.dragging) {
            var oldDragX = this.state.dragX;
            var oldDragY = this.state.dragY;
            var newDragX = event.clientX;
            var newDragY = event.clientY;
            var deltaX = newDragX - oldDragX;
            var deltaY = newDragY - oldDragY;
            var oldPanX = this.state.panX;
            var oldPanY = this.state.panY;
            var newPanX = oldPanX + deltaX;
            var newPanY = oldPanY + deltaY;
            this.setState({
                dragX: newDragX,
                dragY: newDragY,
                panX: newPanX,
                panY: newPanY
            });
        }
    },

    _onMouseUp: function(event) {
        this.setState({
            dragX: null,
            dragY: null,
            dragging: false
        });
    }

});

module.exports = Graph;
