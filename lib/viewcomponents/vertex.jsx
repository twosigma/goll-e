var React = require('react');
var Port = require('./port.jsx');
var UnpinButton = require('./unpinButton.jsx');
var mouseDownDrag = require('../utilities/mouseDownDrag');
var roundedRectanglePath = require('../utilities/roundedRectangle');
var PositionUtils = require('../utilities/positionUtils.js');
var CardinalDirection = require('../enum/cardinalDirection.js');
var PortLabelPosition = require('../enum/portLabelPosition');
var CardinalPortPosition = require('../model/cardinalPortPosition');

var borderRadius = 5;
var padding = 5;
var titlePosition = padding + 10;

var portRadius = 4;
var portSpacing = 15;

var pinX = 130;
var pinY = 0;
var pinScale = 1.5;

// DATA MODEL scales values 0-100. Undo that.
var DATA_MODEL_MULTIPLIER = 100.0;

// TODO: specific to rectangular vertices. Refactor out.
var DIRECTION_TO_LABEL_POSITION = {};

DIRECTION_TO_LABEL_POSITION[CardinalDirection.NORTH] = PortLabelPosition.ABOVE;
DIRECTION_TO_LABEL_POSITION[CardinalDirection.SOUTH] = PortLabelPosition.ABOVE;
DIRECTION_TO_LABEL_POSITION[CardinalDirection.EAST] = PortLabelPosition.LEFT;
DIRECTION_TO_LABEL_POSITION[CardinalDirection.WEST] = PortLabelPosition.RIGHT;


var Vertex = React.createClass({

  render: function() {
    var model = this.props.model;
    var position = model.get('position');
    var showPin = model.get('isPinned');
    var styles = model.get('styles');
    var vertexWidth = styles.get('width');
    var vertexHeight = styles.get('height');

    var titleWidth = vertexWidth - padding * 2;

    var classes = 'vertex shape-' + styles.get('shape');

    return (
      <g
        className={'vertex shape-' + styles.get('shape')}
        transform={'translate(' + position.x + ', ' + position.y + ')'} >
          <path
            d={roundedRectanglePath(0, 0, vertexWidth, vertexHeight, borderRadius)}
            className='vertex-box'
            onMouseDown={mouseDownDrag.bind(this, 'vertex_body', null, null, this._onVertexBodyPseudoDrag)} />
          <path d={roundedRectanglePath(0, 0, vertexWidth, 5, borderRadius, borderRadius, 0, 0)} className="color-bar" fill={styles.get('color')}/>
          {
            React.createElement('foreignObject', {
              x: padding,
              y: titlePosition,
              width: titleWidth,
              height: '20',
              requiredExtensions: 'http://www.w3.org/1999/xhtml'
            },
            (<div className="label" style={{width: titleWidth}}>{model.get('id')}</div>))
          }
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
    var styles = this.props.model.get('styles');
    var portPositionModel = portModel.get('position');
    var portDirection = portPositionModel.get('direction');
    var portPercentage = portPositionModel.get('percentage');

    var labelPosition = DIRECTION_TO_LABEL_POSITION[portPositionModel.get('direction')];

    if (portPercentage/DATA_MODEL_MULTIPLIER * styles.get('height') < titlePosition) {
      if (portDirection === CardinalDirection.WEST) {
        labelPosition = PortLabelPosition.LEFT_OFFSET;
      } else if (portDirection === CardinalDirection.EAST) {
        labelPosition = PortLabelPosition.RIGHT_OFFSET;
      }
    }

    var cartesianPos = PositionUtils.Conversion.cardinalToCartesian(portPositionModel);

    return {
      x: cartesianPos.x * styles.get('width'),
      y: cartesianPos.y * styles.get('height'),
      labelPosition: labelPosition
    };
  },

  _onPortMoveRequested: function(pos, portModel) {
    var styles = this.props.model.get('styles');

    var hPct = pos.x/styles.get('width');
    var vPct = pos.y/styles.get('height');

    var cardinalPosition = PositionUtils.Conversion.cartesianToCardinal({x: hPct, y: vPct});

    portModel.set('position', cardinalPosition);
  }

});

module.exports = Vertex;
