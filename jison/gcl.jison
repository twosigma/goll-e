
%nonassoc COLON_OP CONN_ARROW_OP
%left DOT_OP 

%%

markup
    : definitions EOF
    | EOF
    ;

definitions
    : definition_expression definitions
    | definition_expression 
    ;

definition_expression
    : vertex
    | edge
    | template
    ;

vertex
    : VERTEX_DECL identifier apply_template vertex_body 
    ;

vertex_body
    : LBRACE vertex_expression_list RBRACE
    |
    ;

vertex_expression_list
    : vertex_expression vertex_expression_list
    |
    ;

vertex_expression
    : vertex
    | edge
    | class
    | attribute
    | port
    ;

edge
    : EDGE_DECL identifier arrow_expression apply_template edge_body 
    ;

edge_body
    : LBRACE edge_expression_list RBRACE
    | 
    ;

edge_expression_list
    : edge_expression edge_expression_list
    |
    ;

edge_expression
    : class
    | attribute
    ;

arrow_expression
    : identifier DOT_OP identifier CONN_ARROW_OP identifier DOT_OP identifier
    | identifier CONN_ARROW_OP identifier
    ;

port
    : INPUT_DECL identifier apply_template port_body 
    | OUTPUT_DECL identifier apply_template port_body
    ;

port_body
    : LBRACE port_expression_list RBRACE
    |
    ;

port_expression_list
    : port_expression port_expression_list
    | 
    ;

port_expression
    : class
    | attribute
    ;

template
    : TEMPLATE_DECL vertex_template
    | TEMPLATE_DECL edge_template
    | TEMPLATE_DECL port_template
    ;

vertex_template
    : VERTEX_DECL identifier vertex_body
    ;

edge_template
    : EDGE_DECL identifier edge_body
    ;

port_template
    : PORT_DECL identifier port_body
    ;

apply_template
    : IS_OP identifier
    |
    ; 

class
    : CLASS_DECL string
        { $$ = { 'type': 'CLASS', 'value': $2 }; }
    ;

attribute
    : ATTR_DECL string ATTR_OP string
    ;

identifier
    : ID
    ;

string
    : STR_LITERAL
       { $$ = $1; }
    ;

