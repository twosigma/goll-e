var React = require('react');
var Graph = require('./viewcomponents/graph');

var TEST_DATA = require('./test-data.json');

window.onload = function() {
  React.render(<Graph data={TEST_DATA}/>, document.getElementById('graph-container'));
};
