var React = require('react');
var IO = require('./io.jsx');
var mouseDownDrag = require('../utilities/mouseDownDrag');
var PositionUtils = require('../utilities/positionUtils.js');
var CardinalDirection = require('../enum/cardinalDirection.js');
var IOLabelPosition = require('../enum/ioLabelPosition');
var CardinalPortPosition = require('../model/cardinalPortPosition');
var CartesianPortPosition = require('../model/cartesianPortPosition');

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
    var position = model.get('position');
    var styles = model.get('styles');
    return (
      <g
        className='node'
        transform={'translate(' + position.x + ', ' + position.y + ')'} >
          <rect
            height={styles.height} width={styles.width}
            className='node-box'
            onMouseDown={mouseDownDrag.bind(this, 'node_body', null, null, this._onNodeBodyPseudoDrag)} />
          <text className='label' textAnchor='start' x={padding} y={padding + 10}>
            {model.get('id')}
          </text>
            {this._getRenderedIOs(model.get('inputs'))}
            {this._getRenderedIOs(model.get('outputs'))}
      </g>
    );
  },

  _getRenderedIOs: function(ioModels) {
    return ioModels.map(function(ioModel, id) {
      var ioPositionModel = ioModel.get('position');
      var position = this.props.model.getPortPositionInContext(ioPositionModel);
      var labelPosition = DIRECTION_TO_LABEL_POSITION[ioPositionModel.get('direction')];
      return (
        <IO 
          model={ioModel}
          key={ioModel.get('globalId')}
          x={position.x} y={position.y} label={ioModel.label} labelPosition={labelPosition}
          onMoveRequested={this._onIOMoveRequested}
        />
      );

    }.bind(this));
  },

  _onNodeBodyPseudoDrag: function(event) {
      var oldPos = this.props.model.get('position');
      
      var newX = oldPos.x + event.movementX;
      var newY = oldPos.y + event.movementY;

      // Change the position of the node in the model.
      this.props.model.setPosition(newX, newY);
  },

  _onIOMoveRequested: function(pos, ioModel) {
    var styles = this.props.model.get('styles');

    var hPct = pos.x/styles.width;
    var vPct = pos.y/styles.height;

    var cardinalPosition = PositionUtils.Conversion.cartesianToCardinal(new CartesianPortPosition(hPct, vPct));

    ioModel.set('position', cardinalPosition);
  }

});

module.exports = Node;
