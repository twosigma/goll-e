var React = require('react');
var Graph = require('./viewcomponents/graph');

var TEST_DATA = require('./test-data.json');

var dummyModel = {

    moveNode: function(nodeId, x, y) {
        TEST_DATA.nodes[nodeId].x = x;
        TEST_DATA.nodes[nodeId].y = y;
        renderGraph();
    },

    // This method is for prototype purposes only.
    getAST: function() {
        return TEST_DATA;
    }
};

var renderGraph = function() {
    React.render(<Graph model={dummyModel} />, document.getElementById('graph-container'));
};

window.onload = renderGraph;
