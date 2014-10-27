identifier      [a-zA-Z][a-zA-Z0-9]*
literal         \"[a-zA-Z0-9]*\"

%%
"//".*          /* Ignore Comment */
\s+             /* Ignore Whitespace */
{identifier}    return 'IDENTIFIER';
{literal}       return 'LITERAL';
"+"             return 'INPUT';
"-"             return 'OUTPUT';
":"             return 'COLON';
"."             return 'STYLE';
"->"            return 'ARROW';
"{"             return 'LPAREN';
"}"             return 'RPAREN';
"\""            return 'DQUOTE';
"\'"            return 'SQUOTE';
<<EOF>>         return 'ENDOFFILE';


