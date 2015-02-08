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
- labelPosition
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
      var offset = {x: 0, y: 0};

      var totalMargin = 4 + extraMargin;

      switch (labelPosition) {
        case 'right':
        return {x: totalMargin, y: 0, textAnchor: 'start'};

        case 'left':
        return {x: -totalMargin, y: 0, textAnchor: 'end'};

        case 'above':
        return {x: 0, y: -totalMargin, textAnchor: 'start'};

        case 'below':
        return {x: 0, y: totalMargin, textAnchor: 'start'};

        default:
        return {x: 0, y: 0, textAnchor: 'start'};
      }
    }

});

module.exports = IO;
