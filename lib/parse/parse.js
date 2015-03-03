var Lex = require('./lex');
var SemanticAnalysis = require('./semanticAnalysis');
var ModelFactory = require('./modelFactory');

var parse = function(contentLanguageText) {
  var model = null;
  var gclErrors = [];

  var abtractSyntaxTree = Lex(contentLanguageText);
  gclErrors = SemanticAnalysis(abtractSyntaxTree);
  if (gclErrors.length === 0) {
    model = modelFactory.buildGraphModel(abtractSyntaxTree);
  }

  return {
    model: model,
    gclErrors: gclErrors
  };
};

module.exports = parse;
