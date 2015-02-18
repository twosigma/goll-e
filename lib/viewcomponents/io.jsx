var React = require('react');
var LabelPosition = require('../enum/ioLabelPosition');
var ObjectUtils = require('../utilities/objects');
var IOType = require('../enum/ioType');
var Port = require('../model/port');
var mouseDownDrag = require('../utilities/mouseDownDrag');

var ioRadius = 4;
var BASE_MARGIN = 6;

var IO = React.createClass({
  propTypes: {
    model: React.PropTypes.instanceOf(Port).isRequired,

    x: React.PropTypes.number.isRequired,

    y: React.PropTypes.number.isRequired,

    size: React.PropTypes.number,

    labelPosition: React.PropTypes.oneOf(ObjectUtils.values(LabelPosition)),

    /** callback called when this io, due to user action, would like to move to a new position.
    Passed a new position object.
    It's up to the receiver to actually update the backing model as appropriate.
    If this is not done, the change will revert.
    */
    onMoveRequested: React.PropTypes.func
  },

  getInitialState: function() {
    'use strict';
    return {
      dragging: false
    };
  },

  /* it's the responsibility of the Node to position the IO since it's in its coordinate space */
  render: function() {
    'use strict';
    var model = this.props.model;

    var labelPosition = this._getLabelPositioningData(this.props.labelPosition, this.props.size || ioRadius);

    var classes = React.addons.classSet({
      'io': true,
      'input': model.getType() === IOType.INPUT,
      'output': model.getType() === IOType.OUTPUT,
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
         r={this.props.size || ioRadius}
         cx={0} cy={0}
         onMouseDown={mouseDownDrag.bind(this, 'iomove', this._handleDragStart, this._handleDragEnd, this._handleDragging)}/>
       <text class='label'
         x={labelPosition.x}
         y={labelPosition.y}
         textAnchor={labelPosition.textAnchor} >
         {label}
       </text>
     </g>
     );
  },

  _handleDragStart: function(event) {
    'use strict';
    this.setState({
      dragging: true,
      draggingPosition: {
        x: this.props.x,
        y: this.props.y
      }
    });
  },

  _handleDragEnd: function(event) {
    'use strict';
    var newPos = this.state.draggingPosition;

    this.setState({
      dragging: false
    });

    if (this.props.onMoveRequested) {
      this.props.onMoveRequested(newPos, this.props.model);
    }
  },

  _handleDragging: function(event) {
    'use strict';
    var lastPos = this.state.draggingPosition;

    this.setState({
      draggingPosition: {
        x: lastPos.x + event.movementX,
        y: lastPos.y + event.movementY
      }
    });
  },

  _getLabelPositioningData: function(labelPosition, extraMargin) {
    'use strict';
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

module.exports = IO;
