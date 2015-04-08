var React = require('react');
var AppView = require('./viewcomponents/app.jsx');
var GCLEditorModel = require('./model/content/gclEditorModel');
var loadedStyles = require('./model/style/loadedStyles');
var loadedLayout = require('./model/layout/loadedLayout');

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

loadedLayout.after(['change', 'remove', 'update'], function(){
  renderGraph();
});

loadedStyles.after(['change', 'remove', 'update'], function(){
  renderGraph();
});

window.onload = renderGraph;
