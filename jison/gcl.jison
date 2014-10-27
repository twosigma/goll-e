

%right DOT INPUT OUTPUT
%nonassoc COLON ARROW

%%

/* Graphs consist of node definitions and reflexive connection definitions. */
graph
    : node_declaration connection_declaration ENDOFFILE
    | ENDOFFILE
    ;

/* We can define many nodes in a single graph by recursively appending
   the nodes together. */
node_declaration
    : node node_declaration
    ;

/* Nodes consist of an identifier and list of node expressions
   and connection declarations within a pair of braces. */
node
    : identifier LBRACE node_expression_declaration connection_declaration RBRACE
    ;

/* Nodes can have zero or more node expressions. */
node_expression_delcaration
    : node_expression node_internal
    |
    ;

/* We can have the following things within a node. */
node_expression
    : input_declaration
    | output_declaration
    | style_declaration
    | attribute_declaration
    | node_declaration
    ;

/* A node can have zero or more inputs. */
input_declaration
    : input input_declaration
    |
    ;

/* Inputs are declared with the plus sign operator and are named. */
input
    : INPUT identifier
    ;

/* A node can have zero or more outputs. */
output_declation
    : output output_declaration
    |
    ;

/* Outputs are declared with the minus-sign operator and are named. */
output
    : OUTPUT identifier
    ;

/* A node can have zero or more styles. */
style_declaration
    : style style_declaration
    |
    ;

/* Styles are declared with the dot operator and are named. */
style
    : STYLE identifier
    ;

/* Grammar rule declaring the structure of all of the connection definitions. */
connection_declaraction
    : connection connection_declaraton
    ;

/* Grammar rule declaring the structure of a single connection definition */
/* TODO: Actually do this one. */
connection
    : identifier
    ;

/* Both nodes and connections can have zero or more metadata attributes. */
attribute_declaration
    : attribute attribute_declaration
    |
    ;

/* Metadata maps one identifier to another using the colon operator. */
attribute
    : literal COLON literal
    ;

/* Any token which has at least a single letter, followed by
   any number of characters or numbers. */
identifier
    : IDENTIFIER
    ;

literal
    : LITERAL
    ;

/*
/* Any series of text, numbers or symbols that don't have a quote character. */
string
    : STRING
    ;

/* Any string in quotes. */
literal
    : SQUOTE string SQUOTE
    | DQUOTE string DQUOTE
    ;
*/
