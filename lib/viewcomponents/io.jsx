var React = require('react');
var LabelPosition = require('../enum/ioLabelPosition');
var ObjectUtils = require('../utilities/objects');
var IOType = require('../enum/ioType');
var Port = require('../model/port');

var ioRadius = 4;
var BASE_MARGIN = 6;

var IO = React.createClass({
  propTypes: {
    model: React.PropTypes.instanceOf(Port).isRequired,

    x: React.PropTypes.number.isRequired,

    y: React.PropTypes.number.isRequired,

    size: React.PropTypes.number,

    labelPosition: React.PropTypes.oneOf(ObjectUtils.values(LabelPosition))
  },
  /* it's the responsibility of the Node to position the IO since it's in its coordinate space */
  render: function() {
    var model = this.props.model;

    var labelPosition = this._getLabelPositioningData(this.props.labelPosition, this.props.size || ioRadius);

    var classes = React.addons.classSet({
      'io': true,
      'input': model.getType() === IOType.INPUT,
      'output': model.getType() === IOType.OUTPUT
    });

    var label = model.getId();

    return (
     <g
       className={classes}
       transform={'translate(' + this.props.x + ', ' + this.props.y + ')'} >
       <circle
         r={this.props.size || ioRadius}
         cx={0} cy={0} 
         onMouseDown={this.props.onMouseDown}/>
       <text class="label"
         x={labelPosition.x}
         y={labelPosition.y}
         textAnchor={labelPosition.textAnchor} >
         {label}
       </text>
     </g>
     );
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

module.exports = IO;
