var React = require('react');

var Edge = React.createClass({

  render: function() {
    'use strict';

    var startX;
    var startY;
    var endX;
    var endY;
    var drawString = 'M' + startX + ' ' + startY + ' L' + endX + ' ' + endY;
    return (
        <g className='edge'>
            <path d={drawString}/>
        </g>
    );
  }

});

module.exports = Edge;
