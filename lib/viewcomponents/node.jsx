var React = require('react');
var IO = require('./io.jsx');
var mouseDownDrag = require('../utilities/mouseDownDrag');
var PositionUtils = require('../utilities/positionUtils.js');
var CardinalDirection = require('../enum/cardinalDirection.js');
var IOLabelPosition = require('../enum/ioLabelPosition');
var CardinalPortPosition = require('../model/cardinalPortPosition');

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
    var model = this.props.model;
    var position = model.getPos();
    return (
      <g
        className='node'
        transform={'translate(' + position.x + ', ' + position.y + ')'} >
          <rect
            height={nodeHeight} width={nodeWidth}
            className='node-box'
            onMouseDown={mouseDownDrag.bind(this, 'node_body', null, null, this._onNodeBodyPseudoDrag)} />
          <text className='label' text-anchor='start' x={padding} y={padding + 10}>
            {model.getId()}
          </text>
            {this._getRenderedIOs(model.getInputs(), true)}
            {this._getRenderedIOs(model.getOutputs(), false)}
      </g>
    );
  },

  _getRenderedIOs: function(ioModels, isInput) {
    return ioModels.map(function(ioModel, id) {
      var position = this._getIOPosition(ioModel);

      var onIOMove = function(event) {
        this._onIOMove(event, ioModel);
      }.bind(this);

      return (
        <IO model={ioModel} 
          x={position.x} y={position.y} label={ioModel.label} labelPosition={position.labelPosition}
          onMoveRequested={this._onIOMoveRequested}
        />
      );

    }.bind(this));
  },

  _onNodeBodyPseudoDrag: function(event) {
      var oldPos = this.props.model.getPos();
      
      var newX = oldPos.x + event.movementX;
      var newY = oldPos.y + event.movementY;

      // Change the position of the node in the model.
      this.props.globalModel.moveNode(this.props.model.getId(), newX, newY);
  },

  //TODO: assumes rectangular nodes
  _getIOPosition: function(ioModel) {
    var ioPositionModel = ioModel.getPosition();

    var labelPosition = DIRECTION_TO_LABEL_POSITION[ioPositionModel.getDirection()];

    var cartesianPos = PositionUtils.Conversion.cardinalToCartesian(ioPositionModel);

    return {
      x: cartesianPos.getX() * nodeWidth,
      y: cartesianPos.getY() * nodeHeight,
      labelPosition: labelPosition
    };
  },

  _onIOMoveRequested: function(pos, ioModel) {
    var hPct = pos.x/nodeWidth;
    var vPct = pos.y/nodeHeight;

    var directionToPct = {};
    directionToPct[CardinalDirection.NORTH] = 0;
    directionToPct[CardinalDirection.SOUTH] = 1;
    directionToPct[CardinalDirection.EAST] = 1;
    directionToPct[CardinalDirection.WEST] = 0;

    // figure out what the closest side of the node is
    // we do this in a 2 round competiton
    // E/W and N/S face of and then the winners compete to get the final direction

    // Winner is determined by closeness to the side (calculeted with absolute difference)

    var eastOrWestDirection = Math.abs(hPct) < Math.abs(hPct - 1) ? CardinalDirection.WEST : CardinalDirection.EAST;
    var northOrSouthDirection = Math.abs(vPct) < Math.abs(vPct - 1) ? CardinalDirection.NORTH : CardinalDirection.SOUTH;

    var newPosition;

    if (Math.abs(hPct - directionToPct[eastOrWestDirection]) < Math.abs(vPct - directionToPct[northOrSouthDirection])) {
      var direction = eastOrWestDirection;
      var pct = vPct;
      newPosition = new CardinalPortPosition(direction, pct * DATA_MODEL_MULTIPLIER);
    } else {
      var direction = northOrSouthDirection;
      var pct = hPct;
      newPosition = new CardinalPortPosition(direction, pct * DATA_MODEL_MULTIPLIER);
    }

    ioModel.setPosition(newPosition);

    this.props.globalModel.render();
  },

  _onIOMove: function(event, model) {
    var containerNode = this;

    var position = model.getPosition();

    var newAmount = position.getPercentage()/DATA_MODEL_MULTIPLIER;
    var newDirection = position.getDirection();

    var hDragPct = event.movementX/nodeWidth;
    var vDragPct = event.movementY/nodeHeight;

    switch(position.getDirection()) {
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
      throw 'Unsupported cardinal direction: ' + model.direction;   
    }

    position.setDirection(newDirection);
    position.setPercentage(newAmount * DATA_MODEL_MULTIPLIER);

    containerNode.props.globalModel.render();
  }
});

module.exports = Node;
