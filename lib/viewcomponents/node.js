var React = require('react');
var SVGDraggableMixin = require('../mixins/svgDraggableMixin');

var Node = React.createClass({

    mixins: [SVGDraggableMixin],

    render: function() {
        return (
            <g className='node'>
                <rect className='node-box' x={this.props.x} y={this.props.y} height='93.75' width='150' ref='node_body'></rect>
                <text className='label' text-anchor='start' x={this.props.x + 5} y={this.props.y + 15}>
                    {this.props.label}
                </text>
                {/* inputs and outputs */}
            </g>
        );
    },

    _getDraggableRef: function() {
        return this.refs['node_body'];
    },

    _onDrag: function(event) {
        var oldX = this.props.x;
        var oldY = this.props.y;
        var newX = oldX + event.deltaX;
        var newY = oldY + event.deltaY;
        // Change the position of the node in the model.
        this.props.model.moveNode(this.props.id, newX, newY);
    }
});

module.exports = Node;
