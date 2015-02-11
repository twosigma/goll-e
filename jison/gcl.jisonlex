identifier      [a-zA-Z][^\s+-:.->{}]*
str_literal     \"[^\"\r\n]*\"|\'[^\'\r\n]*\'

%%
"//".*          /* Ignore Comment */
\s+             /* Ignore Whitespace */
"node"          return 'NODE';
"input"         return 'INPUT';
"output"        return 'OUTPUT';
"attribute"     return 'ATTR';
"connection"    return 'CONNECTION';
"style"         return 'STYLE';
"graph"         return 'GRAPH';
{identifier}    return 'IDENTIFIER';
{str_literal}   return 'STR_LITERAL';
"=>"            return 'ARROW';
"->"            return 'REF_ARROW';
"+"             return 'PLUS';
"-"             return 'MINUS';
":"             return 'COLON';
"."             return 'DOT';
"{"             return 'LBRACE';
"}"             return 'RBRACE';
<<EOF>>         return 'ENDOFFILE';


