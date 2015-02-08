var React = require('react');
var IO = require('./io.jsx');
var mouseDownDrag = require('../utilities/mouseDownDrag');
var PositionUtils = require('../utilities/positionUtils.js');
var CardinalDirection = require('../enum/cardinalDirection.js');
var IOLabelPosition = require('../enum/ioLabelPosition');

var nodeWidth = 150;
var nodeHeight = nodeWidth/1.6;
var headerHeight = 35;
var padding = 5;

var ioRadius = 4;
var ioSpacing = 15;

// DATA MODEL scales values 0-100. Undo that.
var DATA_MODEL_MULTIPLIER = 100.0;

// TODO: specific to rectangular nodes. Refactor out.
var DIRECTION_TO_LABEL_POSITION = {};

DIRECTION_TO_LABEL_POSITION[CardinalDirection.NORTH] = IOLabelPosition.BELOW;
DIRECTION_TO_LABEL_POSITION[CardinalDirection.SOUTH] = IOLabelPosition.ABOVE;
DIRECTION_TO_LABEL_POSITION[CardinalDirection.EAST] = IOLabelPosition.LEFT;
DIRECTION_TO_LABEL_POSITION[CardinalDirection.WEST] = IOLabelPosition.RIGHT;


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
      return ios.map(function(io, id) {
        var position = this._getIOPosition(io);

        var onIOMove = function(event) {
          this._onIOMove(event, io);
        }.bind(this);

        return (
          <IO id={id} isInput={isInput} model={io} 
          x={position.x} y={position.y} label={io.label} labelPosition={position.labelPosition}
          onMouseDown={mouseDownDrag.bind(this, 'io', null, null, onIOMove)}
          />
        );

      }.bind(this));
    },

    _onNodeBodyPseudoDrag: function(event) {
        var oldX = this.props.x;
        var oldY = this.props.y;
        var newX = oldX + event.movementX;
        var newY = oldY + event.movementY;
        // Change the position of the node in the model.
        this.props.model.moveNode(this.props.id, newX, newY);
    },

    //TODO: assumes rectangular nodes
    _getIOPosition: function(io) {

      var labelPosition = DIRECTION_TO_LABEL_POSITION[io.direction];

      var cartesianPos = PositionUtils.Conversion.cardinalToCartesian({
        direction: io.direction,
        percentage: io.percentage
      });

      return {
        x: cartesianPos.x * nodeWidth,
        y: cartesianPos.y * nodeHeight,
        labelPosition: labelPosition
      };
    },

    _onIOMove: function(event, model) {
      var containerNode = this;

      var newAmount = model.percentage/DATA_MODEL_MULTIPLIER;
      var newDirection = model.direction;

      var hDragPct = event.movementX/nodeWidth;
      var vDragPct = event.movementY/nodeHeight;

      switch(model.direction) {
        case CardinalDirection.NORTH:
        newAmount += hDragPct;
        if (newAmount > 1) {
          newDirection = CardinalDirection.EAST;
          newAmount = 0;
        } else if (newAmount < 0) {
          newDirection = CardinalDirection.WEST;
          newAmount = 0;
        }

        break;
        case CardinalDirection.SOUTH:
        newAmount += hDragPct;
        if (newAmount > 1) {
          newDirection = CardinalDirection.EAST;
          newAmount = 1;
        } else if (newAmount < 0) {
          newDirection = CardinalDirection.WEST;
          newAmount = 1;
        }
        break;

        case CardinalDirection.EAST:
        newAmount += vDragPct;
        if (newAmount > 1) {
          newDirection = CardinalDirection.SOUTH;
          newAmount = 1;
        } else if (newAmount < 0) {
          newDirection = CardinalDirection.NORTH;
          newAmount = 1;
        }
        break;

        case CardinalDirection.WEST:
        newAmount += vDragPct;
        if (newAmount > 1) {
          newDirection = CardinalDirection.SOUTH;
          newAmount = 0;
        } else if (newAmount < 0) {
          newDirection = CardinalDirection.NORTH;
          newAmount = 0;
        }

        break;

        default:
        throw 'Unsupported cardinal direction';   
      }

      model.direction = newDirection;
      model.percentage = newAmount * DATA_MODEL_MULTIPLIER;

      containerNode.props.model.render();
    }
});

module.exports = Node;
