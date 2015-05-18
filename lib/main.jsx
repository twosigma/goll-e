var React = require('react');
var AppView = require('./viewcomponents/app.jsx');
var GCLEditorModel = require('./model/gclEditorModel');
var openFileManager = require('./files/openFileManager');

var gclEditorModel = new GCLEditorModel();
openFileManager.set('gclEditorModel', gclEditorModel);

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
