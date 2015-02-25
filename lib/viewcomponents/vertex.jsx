var React = require('react');
var Port = require('./port.jsx');
var UnpinButton = require('./unpinButton.jsx');
var mouseDownDrag = require('../utilities/mouseDownDrag');
var PositionUtils = require('../utilities/positionUtils.js');
var CardinalDirection = require('../enum/cardinalDirection.js');
var PortLabelPosition = require('../enum/portLabelPosition');
var CardinalPortPosition = require('../model/cardinalPortPosition');
var CartesianPortPosition = require('../model/cartesianPortPosition');

var vertexWidth = 150;
var vertexHeight = vertexWidth/1.6;
var headerHeight = 35;
var padding = 5;

var portRadius = 4;
var portSpacing = 15;

var pinX = 130;
var pinY = 0;
var pinScale = 1.5;

// DATA MODEL scales values 0-100. Undo that.
var DATA_MODEL_MULTIPLIER = 100.0;

// TODO: specific to rectangular vertices. Refactor out.
var DIRECTION_TO_LABEL_POSITION = {};

DIRECTION_TO_LABEL_POSITION[CardinalDirection.NORTH] = PortLabelPosition.BELOW;
DIRECTION_TO_LABEL_POSITION[CardinalDirection.SOUTH] = PortLabelPosition.ABOVE;
DIRECTION_TO_LABEL_POSITION[CardinalDirection.EAST] = PortLabelPosition.LEFT;
DIRECTION_TO_LABEL_POSITION[CardinalDirection.WEST] = PortLabelPosition.RIGHT;


var Vertex = React.createClass({

  render: function() {
    var model = this.props.model;
    var position = model.get('position');
    var showPin = model.get('isPinned') && this.state.mouseHover;
    return (
      <g
        className='vertex'
        transform={'translate(' + position.x + ', ' + position.y + ')'} >
          <rect
            height={vertexHeight} width={vertexWidth}
            className='vertex-box'
            onMouseDown={mouseDownDrag.bind(this, 'vertex_body', null, null, this._onVertexBodyPseudoDrag)} />
          <text className='label' textAnchor='start' x={padding} y={padding + 10}>
            {model.get('id')}
          </text>
          {// If the node is pinned, show an unpin button.
            showPin?
              <UnpinButton
                onClick={this._unpin}
                transform={'translate(' + pinX + ', ' + pinY + ') scale(' + pinScale + ')'} />:
              null
          }
          {this._getRenderedPorts(model.get('inputs'))}
          {this._getRenderedPorts(model.get('outputs'))}
      </g>
    );
  },

  _getRenderedPorts: function(portModels) {
    return portModels.map(function(portModel, id) {
      var position = this._getPortPosition(portModel);

      return (
        <Port
          model={portModel}
          key={portModel.get('globalId')}
          x={position.x} y={position.y} label={portModel.label} labelPosition={position.labelPosition}
          onMoveRequested={this._onPortMoveRequested}
        />
      );

    }.bind(this));
  },

  _onVertexBodyPseudoDrag: function(event) {
      var oldPos = this.props.model.get('position');

      var newX = oldPos.x + event.movementX;
      var newY = oldPos.y + event.movementY;

      this.props.model.setAttrs({
        isPinned: true,
        position: {x: newX, y: newY}
      });
  },

  _unpin: function() {
    this.props.model.set('isPinned', false);
  },

  //TODO: assumes rectangular vertices
  _getPortPosition: function(portModel) {
    var portPositionModel = portModel.get('position');

    var labelPosition = DIRECTION_TO_LABEL_POSITION[portPositionModel.get('direction')];

    var cartesianPos = PositionUtils.Conversion.cardinalToCartesian(portPositionModel);

    return {
      x: cartesianPos.getX() * vertexWidth,
      y: cartesianPos.getY() * vertexHeight,
      labelPosition: labelPosition
    };
  },

  _onPortMoveRequested: function(pos, portModel) {
    var hPct = pos.x/vertexWidth;
    var vPct = pos.y/vertexHeight;

    var cardinalPosition = PositionUtils.Conversion.cartesianToCardinal(new CartesianPortPosition(hPct, vPct));

    portModel.set('position', cardinalPosition);
  }

});

module.exports = Vertex;
