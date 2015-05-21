var React = require('react');
var AppView = require('./viewcomponents/app.jsx');
var EditorModel = require('./model/editorModel');

var editorModel = new EditorModel();
var openFileManager = require('./files/openFileManager');

openFileManager.set('editorModel', editorModel);

var renderGraph = function() {
  React.render(
    <AppView editorModel={editorModel} />,
    document.getElementById('app-container')
  );
};

editorModel.after('change', function(){
  renderGraph();
});

window.onload = renderGraph;
