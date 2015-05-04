id                 [_a-zA-Z][_a-zA-Z0-9]*
str                \"[^\"\r\n]*\"|\'[^\'\r\n]*\'

%%
"//".*                /* Ignore */
"import"              return 'IMPORT';
"group"               return 'GROUP_DECLARATION_KEYWORD';
"N"                   return 'DIRECTION_NORTH';
"S"                   return 'DIRECTION_SOUTH';
"E"                   return 'DIRECTION_EAST';
"W"                   return 'DIRECTION_WEST';
">"                   return 'SCOPE_OPERATOR';
"."                   return 'PORT_OPERATOR';
"%"                   return 'PERCENT_SIGN';
"{"                   return 'BLOCK_START';
"}"                   return 'BLOCK_END';
"-"?[0-9]+("."[0-9]+)?\b  return 'NUMBER';
{id}                  return 'ID';
{str}                 return 'STRING_LITERAL';
\s+                   /* Ignore Whitespace */
<<EOF>>               return 'EOF';
