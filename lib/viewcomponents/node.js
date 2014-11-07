var React = require('react');

var Node = React.createClass({

  render: function() {
    return (
        <g className='node'>
            <rect className='node-box' x={this.props.x} y={this.props.y} height='93.75' width='150'></rect>
            <text className='label' text-anchor='start' x={this.props.x + 5} y={this.props.y + 15}>
                {this.props.label}
            </text>
            {/* inputs and outputs */}
        </g>
    );
  }

});

module.exports = Node;
