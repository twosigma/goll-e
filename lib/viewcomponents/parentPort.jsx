var React = require('react');
var PortType = require('../enum/portType');

var DEFAULT_BORDER_RADIUS = 10;
var DEFAULT_HEIGHT = 17;
var PORT_DISTANCE = 9;
var PORT_RADIUS = 4;
var AFTER_TEXT_PADDING = 12;

var ParentPort = React.createClass({
  render: function() {
    var model = this.props.model;
    var type = model.get('type');

    var classes = React.addons.classSet({
      'parent-port': true,
      'input': type === PortType.INPUT,
      'output': type === PortType.OUTPUT
    });

    return (
      <g
        className={classes}
        transform={'translate(' + this.props.x + ', ' + this.props.y + ')'} >

        <rect
          ref='rectNode'
          x={-PORT_DISTANCE} y={-DEFAULT_HEIGHT / 2}
          width='0' height={DEFAULT_HEIGHT}
          rx={DEFAULT_BORDER_RADIUS} ry={DEFAULT_BORDER_RADIUS} />
        <circle
          className='port-hole'
          fill='white'
          cx='0'
          cy='0'
          r={PORT_RADIUS} />
        <text x={PORT_RADIUS * 2} y='0' ref='textNode'>{model.get('id')}</text>
      </g>);
  },

  componentDidMount: function() {
    // expand as nessesary
    var textBBox = this.refs.textNode.getDOMNode().getBBox();
    var calculatedWidth = PORT_DISTANCE + PORT_RADIUS * 2 + textBBox.width + AFTER_TEXT_PADDING;
    this.refs.rectNode.getDOMNode().setAttribute('width', calculatedWidth);
  }
});

module.exports = ParentPort;
