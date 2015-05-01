
%{
  var VERTEX_TYPE = 'vertex';
  var PORT_TYPE = 'port';
  var EDGE_TYPE = 'edge';
  var GROUP_TYPE = 'group';
  var CARTESIAN_POSITION_TYPE = 'cartesianPosition';
  var CARDINAL_POSITION_TYPE = 'cardinalPosition';

  var createTopLevel = function(expressionList) {
    var topLevel = {
      'vertexLayouts': {},
      'portLayouts': {},
      'edgeLayouts': {}
    };
    var groups = {
    };

    expressionList.forEach(function(expression) {
      switch (expression.type) {
        case VERTEX_TYPE:
          addToObject(topLevel.vertexLayouts, expression);
          break;
        case PORT_TYPE:
          addToObject(topLevel.portLayouts, expression);
          break;
        case EDGE_TYPE:
          addToObject(topLevel.edgeLayouts, expression);
          break;
        case GROUP_TYPE:
          addToObject(groups, expression);
          break;
      }
    });

    // Integrate groups into vertex layouts.
    for (var groupId in groups) {
      groups[groupId].forEach(function(vertexId) {
        var layouts = topLevel.vertexLayouts;
        if (layouts[vertexId]) {
          layouts[vertexId] = {};
        }
        if (layouts[vertexId].group) {
          // TODO semantic error, as a vertex can belong to at most one group
        } else {
          layouts[vertexId].group = groupId;
        }
      });
    }

    return topLevel;
  };

  var addToObject = function(obj, element) {
    var id = element.id;
    delete element.id;
    delete element.type;
    obj[id] = element;
  };

  var prependListValue = function(list, value) {
    list.unshift(value);
    return list;
  };
%}

%ebnf

%%

markup
    : layout_expressions EOF
        {{
            $$ = createTopLevel($1);
            return $$;
        }}
    | EOF
        {{
            $$ = createTopLevel([]);
            return $$;
        }}
    ;

layout_expressions
    : layout_expression layout_expressions
        {{ $$ = prependListValue( $2, $1 ); }}
    | layout_expression
        {{ $$ = [$1]; }}
    ;

layout_expression
    : vertex_layout
        {{ $$ = $1; }}
    | port_layout
        {{ $$ = $1; }}
    | edge_layout
        {{ $$ = $1; }}
    | group
        {{ $$ = $1; }}
    ;

vertex_layout
    : vertex_declaration cartesian_position
        {{ $$ = {
          'type': VERTEX_TYPE,
          'id': $1,
          'position': $2
        }; }}
    ;

port_layout
    : port_declaration cardinal_position
        {{ $$ = {
          'type': PORT_TYPE,
          'id': $1,
          'position': $2
        }; }}
    ;

edge_layout
    : edge_declaration BLOCK_START cartesian_position_list BLOCK_END
        {{ $$ = {
          'type': EDGE_TYPE,
          'id': $1,
          'position' : $3
        }; }}
    ;

group
    : GROUP_DECLARATION ID BLOCK_START vertex_list BLOCK_END
        {{ $$ = {
          'type': GROUP_TYPE,
          'id': $2,
          'vertices': $4
        }; }}
    ;

vertex_list
    : vertex_or_edge_id
        {{ $$ = $1; }}
    | vertex_or_edge_id vertex_list
        {{ $$ = prependListValue( $2, $1 ); }}
    ;

vertex_or_edge_id
    : ID
        {{ $$ = $1; }}
    | vertex_or_edge_id SCOPE_OPERATOR ID
        {{ $$ = $1 + $2 + $3; }}
    ;

vertex_declaration
    : VERTEX_DECLARATION_KEYWORD vertex_or_edge_id
        {{ $$ = $2; }}
    ;

edge_declaration
    : EDGE_DECLARATION_KEYWORD vertex_or_edge_id
        {{ $$ = $2; }}
    ;

port_id
    : vertex_or_edge_id PORT_SCOPE_OPERATOR ID
        {{ $$ = $1 + $2 + $3; }}
    ;

port_declaration
    : PORT_DECLARATION_KEYWORD port_id
        {{ $$ = $2; }}
    ;

cartesian_position_list
    : cartesian_position
        {{ $$ = $1; }}
    | cartesian_position cartesian_position_list
        {{ $$ = prependListValue( $2, $1 ); }}
    ;

cartesian_position
    : NUMBER NUMBER
        {{ $$ = {
          'x': $1,
          'y': $2
        }; }}
    ;

cardinal_position
    : direction percentage
        {{ $$ = {
          'direction': $1,
          'percentage': $2
        }; }}
    ;

percentage
    : NUMBER PERCENT_SIGN
        {{ $$ = $1; }}
    ;

direction
    : DIRECTION_NORTH
        {{ $$ = 'N'; }}
    | DIRECTION_SOUTH
        {{ $$ = 'S'; }}
    | DIRECTION_EAST
        {{ $$ = 'E'; }}
    | DIRECTION_WEST
        {{ $$ = 'W'; }}
    ;
