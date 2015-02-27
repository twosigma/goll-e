var ASTExample = require('./ASTExample.json');

var lex = function(someGCL) {
  // TODO: Make an abstract syntax tree based on the GCL string.

  // For now, we have no implementation for this, so we just return our example AST.
  return ASTExample;
};

module.exports = lex;
