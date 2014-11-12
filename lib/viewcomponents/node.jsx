var React = require('react');
var mouseDownDrag = require('../utilities/mouseDownDrag');

var Node = React.createClass({

    render: function() {
        return (
            <g className='node'>
                <rect
                    className='node-box'
                    x={this.props.x} y={this.props.y} height='93.75' width='150'
                    onMouseDown={mouseDownDrag.bind(this, 'node_body', null, null, this._onNodeBodyPseudoDrag)} />
                <text className='label' text-anchor='start' x={this.props.x + 5} y={this.props.y + 15}>
                    {this.props.label}
                </text>
                {/* inputs and outputs */}
            </g>
        );
    },

    _onNodeBodyPseudoDrag: function(event) {
        var oldX = this.props.x;
        var oldY = this.props.y;
        var newX = oldX + event.movementX;
        var newY = oldY + event.movementY;
        // Change the position of the node in the model.
        this.props.model.moveNode(this.props.id, newX, newY);
    }
});

module.exports = Node;
