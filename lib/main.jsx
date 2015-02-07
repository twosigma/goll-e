var React = require('react');
var App = require('./viewcomponents/app.jsx');

var TEST_DATA = require('./test-data.json');

var dummyModel = {

    moveNode: function(nodeId, x, y) {
        TEST_DATA.nodes[nodeId].x = x;
        TEST_DATA.nodes[nodeId].y = y;
        renderGraph();
    },

    setContents: function(newContents){
        TEST_DATA = JSON.parse(newContents);
        renderGraph();
    },

    // This method is for prototype purposes only.
    getContents: function() {
        return TEST_DATA;
    },

    render: function() {
      renderGraph();
    }
};

var renderGraph = function() {
    React.render(<App model={dummyModel} />, document.getElementById('app-container'));
};

window.onload = renderGraph;
