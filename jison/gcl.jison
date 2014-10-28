
%nonassoc COLON ARROW
%right REF_ARROW
%right DOT PLUS MINUS

%%

/* Graphs consist of node definitions and reflexive connection definitions. */
graph
    : node_declarations connection_declarations ENDOFFILE
    ;

/* We can define many nodes in a single graph by recursively appending
   the nodes together. */
node_declarations
    : node node_declarations
    |
    ;

/* Nodes consist of an identifier and list of node expressions
   and connection declarations within a pair of braces. */
node
    : identifier
    | identifier LBRACE node_expression_declarations RBRACE
    ;

/* Nodes can have zero or more node expressions. */
node_expression_declarations
    : node_expression node_expression_declarations
    |
    ;

/* We can have the following things within a node. */
node_expression
    : node
    | input
    | output
    | style
    | attribute
    | connection
    ;

/**
 * Production rule which handles input declarations.
 */
input
    : PLUS identifier
    | PLUS identifier LBRACE expression_declaration RBRACE
    ;

/**
 * Production rule which handles output declarations.
 */
output
    : MINUS identifier
    | MINUS identifier LBRACE expression_declaration RBRACE
    ;

/**
 * Production rule which handles style declarations.
 */
style
    : DOT identifier
    ;

/**
 * Production rule which handles attribute declarations.
 */
attribute
    : string_literal COLON string_literal 
    ;

/**
 * Production rule which allows for right-recursive declarations of a list
 * of connections.
 */
connection_declarations
    : connection connection_declarations
    |
    ;

/**
 * Production rule which handles connection declarations.
 */
connection
    : CONNECTION identifier directional_dereference ARROW directional_dereference
    | CONNECTION identifier directional_dereference ARROW directional_dereference LBRACE expression_declaration RBRACE
    ;

/**
 * Production rule for the expression which mades an input or output from
 * a node available for connection.
 */ 
directional_dereference
    : identifier
    | identifier REF_ARROW identifier
    ;

/**
 * Production rule which allows for right-recursive declarations of a generic 
 * expression in the language.
 */
expression_declaration
    : expression expression_declaration
    |
    ;

/**
 * Production rule for a basic expression. These appear in attributes and
 * connections but not nodes.
 */
expression
    : style
    | attribute
    ;

/**
 * Production rule which aliases to any identifier.
 */
identifier
    : IDENTIFIER
    ;

/**
 * Production rule which aliases to any string literal.
 */
string_literal
    : STR_LITERAL
    ;


