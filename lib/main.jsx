var React = require('react');
var App = require('./viewcomponents/app.jsx');

var TEST_DATA = require('./test-data.json');

var dummyModel = {

    moveNode: function(nodeId, x, y) {
        TEST_DATA.nodes[nodeId].x = x;
        TEST_DATA.nodes[nodeId].y = y;
        renderGraph();
    },

    setAST: function(newAST){
        TEST_DATA = JSON.parse(newAST);
        renderGraph();
    },

    // This method is for prototype purposes only.
    getAST: function() {
        return TEST_DATA;
    }
};

var renderGraph = function() {
    React.render(<App model={dummyModel} />, document.getElementById('app-container'));
};

window.onload = renderGraph;
