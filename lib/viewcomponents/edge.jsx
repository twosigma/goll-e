var React = require('react');
var mouseDownDrag = require('../utilities/mouseDownDrag');
var PositionUtils = require('../utilities/positionUtils.js');
var CardinalDirection = require('../enum/cardinalDirection.js');
var CardinalPortPosition = require('../model/cardinalPortPosition');
var Graph = require('../model/graph');
var Edge = require('../model/edge');
var smoothCurevedEdges = require('./smoothCurvedEdges.jsx');
var ReroutePoint = require('../model/reroutePoint');

var HANDLE_RADIUS = 7;

var Edge = React.createClass({

  propTypes: {
    model: React.PropTypes.instanceOf(Edge),
    container: React.PropTypes.instanceOf(Graph)
  },

  render: function() {
    var model = this.props.model;
    var container = this.props.container;

    return (
      <g
      ref="edge"
      className="edge">
        <g className="lines">{this._getLinePaths()}</g>
        <g className="handles">{this._getDragHandles()}</g>
      </g>
    );
  },

  _getLinePaths: function() {
    var edge = this.props.model;
    var graph = this.props.container;

    var sourcePos = edge.getStartPositionIn(graph);
    var targetPos = edge.getEndPositionIn(graph);
    var reroutePoints = edge.get('layout').get('reroutePoints');
    return smoothCurevedEdges(sourcePos, reroutePoints, targetPos, this._addReroutePointHandler);
  },

  _getDragHandles: function() {
    var edge = this.props.model;
    var graph = this.props.container;
    var reroutePoints = edge.get('layout').get('reroutePoints');

    var sourcePos = edge.getStartPositionIn(graph);
    var targetPos = edge.getEndPositionIn(graph);

    return reroutePoints.toArray().map(function(reroutePoint, i) {
      var plain = reroutePoint.getAbsolute(sourcePos, targetPos);
      return (<circle
        className="handle"
        key={i}
        onMouseDown={mouseDownDrag.bind(this, 'handle_'+i, null, null, this._handleRerouteDrag.bind(this, reroutePoint))}
        r={HANDLE_RADIUS}
        cx={plain.x} cy={plain.y} />);
    }, this);
  },

  _handleRerouteDrag: function(reroutePoint, e) {
    reroutePoint.setAttrs({
      x: reroutePoint.get('x') + e.movementX,
      y: reroutePoint.get('y') + e.movementY
    });
  }
});


module.exports = Edge;
