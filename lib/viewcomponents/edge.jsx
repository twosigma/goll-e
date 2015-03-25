var React = require('react');
var mouseDownDrag = require('../utilities/mouseDownDrag');
var Graph = require('../model/graph');
var EdgeModel = require('../model/edge');
var smoothCurevedEdges = require('./smoothCurvedEdges.jsx');

var HANDLE_RADIUS = 7;

var Edge = React.createClass({

  propTypes: {
    model: React.PropTypes.instanceOf(EdgeModel),
    container: React.PropTypes.instanceOf(Graph)
  },

  render: function() {
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
        onMouseDown={mouseDownDrag.bind(this, 'handle_' + i, null, null, this._handleRerouteDrag.bind(this, reroutePoint))}
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
