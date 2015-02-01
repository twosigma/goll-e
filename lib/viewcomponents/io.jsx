var React = require('react');
var mouseDownDrag = require('../utilities/mouseDownDrag');

var ioRadius = 4;
/*
props:
- isInput {Boolean}
- label {String}
- x {Number}
- y {Number}
- size (radius) {Number}
 */
var IO = React.createClass({
    /* it's the responsibility of the Node to position the IO since it's in its coordinate space */
    render: function() {
        var isInput = this.props.isInput;
        var ioClass = isInput ? 'input' : 'output';

        var labelPosition = this._getLabelPositioningData(this.props.labelPosition, this.props.size || ioRadius);

        return (
           <g
            className={'io ' + ioClass}
            transform={'translate(' + this.props.x + ', ' + this.props.y + ')'} >
            <circle
              r={this.props.size || ioRadius}
              cx={0} cy={0} />
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
      var offset = {x: 0, y: 0};

      var totalMargin = 4 + extraMargin;

      if (labelPosition === 'right') {
        return {x: totalMargin, y: 0, textAnchor: 'start'};
      } else if (labelPosition === 'left') {
        return {x: -totalMargin, y: 0, textAnchor: 'end'};
      } else if (labelPosition === 'above') {
        return {x: 0, y: totalMargin, textAnchor: 'start'};
      } else if (labelPosition === 'below') {
        return {x: 0, y: -totalMargin, textAnchor: 'start'}
      } else {
        return {x: 0, y: 0, textAnchor: 'start'}
      }
    }

});

module.exports = IO;
