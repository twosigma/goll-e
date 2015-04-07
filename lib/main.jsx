var React = require('react');
var AppView = require('./viewcomponents/app.jsx');
var GCLEditorModel = require('./model/gclEditorModel');

var gclEditorModel = new GCLEditorModel();

var renderGraph = function() {
  React.render(
    <AppView gclEditorModel={gclEditorModel} />,
    document.getElementById('app-container')
  );
};

gclEditorModel.after('change', function(){
  renderGraph();
});

window.onload = renderGraph;
