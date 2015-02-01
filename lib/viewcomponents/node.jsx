var React = require('react');
var IO = require('./io.jsx');
var mouseDownDrag = require('../utilities/mouseDownDrag');

var nodeWidth = 150;
var nodeHeight = nodeWidth/1.6;
var headerHeight = 35;
var padding = 5;

var ioRadius = 4;
var ioSpacing = 15;

var Node = React.createClass({

    render: function() {
        return (
            <g
             className='node'
             transform={'translate(' + this.props.x + ', ' + this.props.y + ')'} >
                <rect
                    height={nodeHeight} width={nodeWidth}
                    className='node-box'
                    onMouseDown={mouseDownDrag.bind(this, 'node_body', null, null, this._onNodeBodyPseudoDrag)} />
                <text className='label' text-anchor='start' x={padding} y={padding + 10}>
                    {this.props.label}
                </text>
                {this._getRenderedIOs(this.props.inputs, true)}
                {this._getRenderedIOs(this.props.outputs, false)}
            </g>
        );
    },

    _getRenderedIOs: function(ios, isInput) {
      return ios.map(function(io) {
        var position = this._getIOPosition(io);
        return (
          <IO isInput={isInput} x={position.x} y={position.y} label={io.label} labelPosition={position.labelPosition}/>
        );
      }.bind(this))
    },

    _onNodeBodyPseudoDrag: function(event) {
        var oldX = this.props.x;
        var oldY = this.props.y;
        var newX = oldX + event.movementX;
        var newY = oldY + event.movementY;
        // Change the position of the node in the model.
        this.props.model.moveNode(this.props.id, newX, newY);
    },

    _getIOPosition: function(io) {
      // DATA MODEL scales values 0-100 for some reason. Undo that.
      // It also comes it upside down. Make it upside up.
      var DATA_MODEL_MULTIPLIER = 100;
      var labelPosition;
      if (io.x === 0) {
        labelPosition = 'right';
      } else if (io.x/DATA_MODEL_MULTIPLIER === 1) {
        labelPosition = 'left';
      } else {
        if (io.y/DATA_MODEL_MULTIPLIER > 0.5) {
          labelPosition = 'below';
        } else {
          labelPosition = 'above';
        }
      }

      return {
        x: io.x/DATA_MODEL_MULTIPLIER * nodeWidth,
        y: nodeHeight - (io.y/DATA_MODEL_MULTIPLIER * nodeHeight),
        labelPosition: labelPosition
      };
    }
});

module.exports = Node;
