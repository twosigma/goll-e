id                 [_a-zA-Z][_a-zA-Z0-9]*
str                \"[^\"\r\n]*\"|\'[^\'\r\n]*\'

%%
"//".*                /* Ignore */
"import"              return 'IMPORT';
"vertex"              return 'VERTEX_DECLARATION_KEYWORD';
"port"                return 'PORT_DECLARATION_KEYWORD';
"edge"                return 'EDGE_DECLARATION_KEYWORD';
"."                   return 'PORT_SCOPE';
"group"               return 'GROUP_DECLARATION';
"n""orth"?i           return 'DIRECTION_NORTH';
"s""outh"?i           return 'DIRECTION_SOUTH';
"e""ast"?i            return 'DIRECTION_EAST';
"w""est"?i            return 'DIRECTION_WEST';
">"                   return 'SCOPE_OPERATOR';
"."                   return 'PORT_OPERATOR';
"%"                   return 'PERCENT_SIGN';
"{"                   return 'BLOCK_START';
"}"                   return 'BLOCK_END';
[0-9]+("."[0-9]+)?\b  return 'NUMBER';
{id}                  return 'ID';
{str}                 return 'STRING_LITERAL';
\s+                   /* Ignore Whitespace */
<<EOF>>               return 'EOF';
