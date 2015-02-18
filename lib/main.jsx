var React = require('react');
var App = require('./viewcomponents/app.jsx');
var GraphParser = require('./model/graphParser');

var TEST_DATA = require('./test-data.json');

var parser = new GraphParser();
var graph = parser.parseGraph(TEST_DATA);

var dummyModel = {

    _setFromJson: function(json) {
      var parser = new GraphParser();
      var graph = parser.parseGraph(json);
    },

    moveNode: function(vertexId, x, y) {
        graph.getVertexById(vertexId).setPosition(x, y);
        renderGraph();
    },

    getGraph: function() {
      return graph;
    },

    render: function() {
      renderGraph();
    }
};

var renderGraph = function() {
    React.render(<App model={dummyModel} />, document.getElementById('app-container'));
};

window.onload = renderGraph;
