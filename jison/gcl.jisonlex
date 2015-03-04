id                 [_a-zA-Z][_a-zA-Z0-9]*
str                \"[^\"\r\n]*\"|\'[^\'\r\n]*\'

%%
"//".*             /* Ignore */
"import"           return 'IMPORT';
"vertex"           return 'VERTEX_DECL';
"edge"             return 'EDGE_DECL';
"template"         return 'TEMPLATE_DECL';
"input"            return 'INPUT_DECL';
"output"           return 'OUTPUT_DECL';
"class"            return 'CLASS_DECL';
"attribute"        return 'ATTR_DECL';
"is"               return 'IS_OP';
"->"               return 'CONN_ARROW_OP';
":"                return 'ATTR_OP';
"."                return 'DOT_OP';
"{"                return 'LBRACE';
"}"                return 'RBRACE';
{id}               return 'ID';
{str}              return 'STR_LITERAL';
\s+                /* Ignore Whitespace */
<<EOF>>            return 'EOF';


