var React = require('react');
var AppView = require('./viewcomponents/app.jsx');
var GCLEditorModel = require('./model/gclEditorModel');

var gclEditorModel = new GCLEditorModel();

gclEditorModel.after('change', function(){
  renderGraph();
});

var renderGraph = function() {
  React.render(
    <AppView gclEditorModel={gclEditorModel} />,
    document.getElementById('app-container')
  );
};

window.onload = renderGraph;
