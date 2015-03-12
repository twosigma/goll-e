var React = require('react');
var App = require('./viewcomponents/app.jsx');
var GraphParser = require('./model/graphParser');

var TEST_DATA = require('./test-data.json');

var parser = new GraphParser();
var graph = parser.parseGraph(TEST_DATA);
var SpringLayoutEngine = require('./layout/forceDirectedLayout');

// rerender on any change
// graph.after('change', renderGraph);
SpringLayoutEngine(graph);
graph.after('change', function(e) {
  renderGraph();
});

var renderGraph = function() {
  React.render(<App graphModel={graph} />, document.getElementById('app-container'));
};

window.onload = renderGraph;