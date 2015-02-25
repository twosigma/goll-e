var React = require('react');

var pinImagePath = 'M19.5,37l10,0l1.07178,24.5l3.01953,0l0.908691,-24.5l10.5,0c0,0 -0.332361,-10.3673 -7.5,-10.5c0.272303,-18.12 0,-18.5 0,-18.5l2,0l0,-3.5l-15,0l0,3.5l2,0c0,0 -0.039881,0.0580001 0,18.5c-7.62955,0.0191484 -7,10.5 -7,10.5Z';
var pinImageTransform = 'rotate(30) scale(0.25) translate(-32, -32)';

var UnpinButton = React.createClass({

  render: function() {
    return (
      <g className='unpinButton' {...this.props}>
        <circle className='background' cx='0' cy='0' r='8' />
        <path d={pinImagePath} x={0} y={0} transform={pinImageTransform} />
      </g>
    );
  }

});

module.exports = UnpinButton;
