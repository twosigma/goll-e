var React = require('react');
var LabelPosition = require('../enum/portLabelPosition');
var ObjectUtils = require('../utilities/objects');
var UnpinButton = require('./unpinButton.jsx');
var PortType = require('../enum/portType');
var PortModel = require('../model/port');
var mouseDownDrag = require('../utilities/mouseDownDrag');

var portRadius = 4;
var BASE_MARGIN = 6;

var pinX = 10;
var pinY = -22;
var pinScale = 1;

var yOffset = 8;

var Port = React.createClass({
  propTypes: {
    model: React.PropTypes.instanceOf(PortModel).isRequired,

    x: React.PropTypes.number.isRequired,

    y: React.PropTypes.number.isRequired,

    size: React.PropTypes.number,

    labelPosition: React.PropTypes.oneOf(ObjectUtils.values(LabelPosition)),

    /** callback called when this port, due to user action, would like to move to a new position.
    Passed a new position object.
    It's up to the receiver to actually update the backing model as appropriate.
    If this is not done, the change will revert.
    */
    onMoveRequested: React.PropTypes.func,

    zoomScale: React.PropTypes.number
  },

  getInitialState: function() {
    return {
      dragging: false
    };
  },

  /* it's the responsibility of the Node to position the port since it's in its coordinate space */
  render: function() {
    var model = this.props.model;
    var showPin = model.get('isPinned');
    var labelPosition = this._getLabelPositioningData(this.props.labelPosition, this.props.size || portRadius);

    var classes = React.addons.classSet({
      'port': true,
      'input': model.get('type') === PortType.INPUT,
      'output': model.get('type') === PortType.OUTPUT,
      'dragging': this.state.dragging
    });

    var label = model.get('id');

    var pos;
    if (this.state.dragging) {
      pos = this.state.draggingPosition;
    } else {
      pos = {x: this.props.x, y: this.props.y};
    }

    return (
     <g
       className={classes}
       transform={'translate(' + pos.x + ', ' + pos.y + ')'} >
       <circle
         r={this.props.size || portRadius}
         cx={0} cy={0}
         onMouseDown={mouseDownDrag.bind(this, 'portmove', this._handleDragStart, this._handleDragEnd, this._handleDragging, this.props.zoomScale)}/>
       <text className='label'
         x={labelPosition.x}
         y={labelPosition.y}
         textAnchor={labelPosition.textAnchor} >
         {label}
       </text>
       {// If the node is pinned, show an unpin button.
         showPin ?
            <UnpinButton
              onClick={this._unpin}
              transform={'translate(' + pinX + ', ' + pinY + ') scale(' + pinScale + ')'} /> :
            null
          }
     </g>
     );
  },

  _unpin: function() {
    this.props.model.set('isPinned', false);
  },

  _handleDragStart: function() {
    this.setState({
      dragging: true,
      draggingPosition: {
        x: this.props.x,
        y: this.props.y
      }
    });
  },

  _handleDragEnd: function() {
    var newPos = this.state.draggingPosition;

    this.setState({
      dragging: false
    });

    if (this.props.onMoveRequested) {
      this.props.onMoveRequested(newPos, this.props.model);
    }
  },

  _handleDragging: function(event) {
    var lastPos = this.state.draggingPosition;

    this.setState({
      draggingPosition: {
        x: lastPos.x + event.scaledMovementX,
        y: lastPos.y + event.scaledMovementY
      }
    });
  },

  _getLabelPositioningData: function(labelPosition, extraMargin) {
    var totalMargin = BASE_MARGIN + extraMargin;

    switch (labelPosition) {
      case LabelPosition.RIGHT:
      return {x: totalMargin, y: 0, textAnchor: 'start'};

      case LabelPosition.LEFT:
      return {x: -totalMargin, y: 0, textAnchor: 'end'};

      case LabelPosition.RIGHT_OFFSET:
      return {x: totalMargin, y: -yOffset, textAnchor: 'start'};

      case LabelPosition.LEFT_OFFSET:
      return {x: -totalMargin, y: -yOffset, textAnchor: 'end'};

      case LabelPosition.ABOVE:
      return {x: 0, y: -totalMargin, textAnchor: 'start'};

      case LabelPosition.BELOW:
      return {x: 0, y: totalMargin, textAnchor: 'start'};

      default:
      return {x: 0, y: 0, textAnchor: 'start'};
    }
  }

});

module.exports = Port;
