identifier      [a-zA-Z][^\s+-:.->{}]*
str_literal     \"[^\"\r\n]*\"|\'[^\'\r\n]*\'

%%
"//".*          /* Ignore Comment */
\s+             /* Ignore Whitespace */
"template"      return 'RESERVED';
"import"        return 'RESERVED';
"extends"       return 'RESERVED';
"node"          return 'RESERVED';
"input"         return 'RESERVED';
"output"        return 'RESERVED';
"attribute"     return 'RESERVED';
"style"         return 'RESERVED';
"graph"         return 'RESERVED';
"connection"    return 'CONNECTION';
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


