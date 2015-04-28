var React = require('react');
var AppView = require('./viewcomponents/app.jsx');
var EditorModel = require('./model/editorModel');
var loadedStyles = require('./model/style/loadedStyles');
var loadedLayout = require('./model/layout/loadedLayout');

var editorModel = new EditorModel();

var renderGraph = function() {
  React.render(
    <AppView editorModel={editorModel} />,
    document.getElementById('app-container')
  );
};

editorModel.after('change', function(){
  renderGraph();
});

loadedLayout.after(['change', 'update'], function(){
  renderGraph();
});

loadedStyles.after(['change', 'update'], function(){
  renderGraph();
});

window.onload = renderGraph;
