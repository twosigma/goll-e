var React = require('react');
var LabelPosition = require('../enum/ioLabelPosition');
var ObjectUtils = require('../utilities/objects');

var ioRadius = 4;
var BASE_MARGIN = 6;

var IO = React.createClass({
  propTypes: {
    isInput: React.PropTypes.bool.isRequired,

    label: React.PropTypes.string,

    x: React.PropTypes.number.isRequired,

    y: React.PropTypes.number.isRequired,

    size: React.PropTypes.number,

    labelPosition: React.PropTypes.oneOf(ObjectUtils.values(LabelPosition))
  },
  /* it's the responsibility of the Node to position the IO since it's in its coordinate space */
  render: function() {
    var isInput = this.props.isInput;

    var labelPosition = this._getLabelPositioningData(this.props.labelPosition, this.props.size || ioRadius);

    var classes = React.addons.classSet({
      'io': true,
      'input': isInput,
      'output': !isInput
    });

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
         {this.props.label}
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
