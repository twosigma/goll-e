var React = require('react');
var LabelPosition = require('../enum/portLabelPosition');
var ObjectUtils = require('../utilities/objects');
var PortType = require('../enum/portType');
var PortModel = require('../model/port');
var mouseDownDrag = require('../utilities/mouseDownDrag');

var portRadius = 4;
var BASE_MARGIN = 6;

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
    onMoveRequested: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      dragging: false
    };
  },

  /* it's the responsibility of the Node to position the port since it's in its coordinate space */
  render: function() {
    var model = this.props.model;

    var labelPosition = this._getLabelPositioningData(this.props.labelPosition, this.props.size || portRadius);

    var classes = React.addons.classSet({
      'port': true,
      'input': model.getType() === PortType.INPUT,
      'output': model.getType() === PortType.OUTPUT,
      'dragging': this.state.dragging
    });

    var label = model.getId();

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
         onMouseDown={mouseDownDrag.bind(this, 'portmove', this._handleDragStart, this._handleDragEnd, this._handleDragging)}/>
       <text class="label"
         x={labelPosition.x}
         y={labelPosition.y}
         textAnchor={labelPosition.textAnchor} >
         {label}
       </text>
     </g>
     );
  },

  _handleDragStart: function(event) {
    this.setState({
      dragging: true,
      draggingPosition: {
        x: this.props.x,
        y: this.props.y
      }
    });
  },

  _handleDragEnd: function(event) {
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
        x: lastPos.x + event.movementX,
        y: lastPos.y + event.movementY
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
