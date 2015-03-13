var generateAST = require('./../../jison/gcl').parse;
var semanticAnalysis = require('./semanticAnalysis');
var buildGraph = require('./modelFactory').buildGraph;

var parse = function(contentLanguageText) {
  var model = null;
  var gclErrors = [];

  var abtractSyntaxTree = generateAST(contentLanguageText);
  gclErrors = semanticAnalysis(abtractSyntaxTree);
  if (gclErrors.length === 0) {
    model = buildGraph(abtractSyntaxTree);
  }

  return {
    model: model,
    gclErrors: gclErrors
  };
};

module.exports = parse;
