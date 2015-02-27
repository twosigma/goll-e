var React = require('react');
var App = require('./viewcomponents/app.jsx');
var ModelFactory = require('./parse/modelFactory');
var Lex = require('./parse/lex');
var SemanticAnalysis = require('./parse/semanticAnalysis');

var ASTExample = require('./parse/ASTExample.json');

var modelFactory = new ModelFactory();
var graph = modelFactory.buildGraphModel(ASTExample);
var gclErrors = [];

// rerender on any change
// graph.after('change', renderGraph);
graph.after('change', function(e) {
  renderGraph();
});

var renderGraph = function() {
  React.render(<App graphModel={graph} gclErrors={gclErrors} />, document.getElementById('app-container'));
};

// TODO: Call this function when the text in the editor changes.
var renderGraphFromGCL = function(contentLanguageText) {
  var abtractSyntaxTree = Lex(contentLanguageText);
  gclErrors = SemanticAnalysis(abtractSyntaxTree);
  if (gclErrors.length === 0) {
    graph = modelFactory.buildGraphModel(abtractSyntaxTree);
  }
  renderGraph();
}

window.onload = renderGraph;
