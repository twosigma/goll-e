var React = require('react');
var mouseDownDrag = require('../utilities/mouseDownDrag');
var Graph = require('../model/content/graph');
var EdgeModel = require('../model/content/edge');
var smoothCurvedEdges = require('./smoothCurvedEdges.jsx');
var globalToLocalCoordinates = require('../utilities/globalToLocalCoordinates');
var ParentPort = require('./parentPort.jsx');

var getPointDistanceFromPoint;

var HANDLE_RADIUS = 7;
var PSEUDO_PORT_DISTANCE = 50;

var Edge = React.createClass({

  propTypes: {
    model: React.PropTypes.instanceOf(EdgeModel),
    container: React.PropTypes.instanceOf(Graph),
    parentScale: React.PropTypes.number
  },

  getDefaultProps: function() {
    return {
      parentScale: 1
    };
  },

  /*
  The following methods simulate a drag start when a reroute point is added so that it may be dragged immeditately
  (even though the drawn point won't exist until it re-renders)
   */

  componentWillMount: function() {
    this._bindAddRerouteEvent();
  },

  componentWillReceiveProps: function(nextProps) {
    this._unbindAddRerouteEvent();
    this._bindAddRerouteEvent(nextProps);
  },

  componentWillUnmount: function() {
    this._unbindAddRerouteEvent();
  },

  _bindAddRerouteEvent: function(props) {
    props = props || this.props;
    // hacka hacka hacka
    this._rerouteAddEventHandle = props.model.getLayout().get('reroutePoints').after('add', function(e) {
      mouseDownDrag.call(this, 'handle_' + e.index, null, null, this._handleRerouteDrag.bind(this, e.value, e.index), null);
    }, this);
  },

  _unbindAddRerouteEvent: function() {
    this._rerouteAddEventHandle.detach();
  },

  render: function() {
    return (
      <g
      ref='edge'
      className='edge'>
        <g className='pseudo-ports'>{this._getPseudoPorts()}</g>
        <g className='lines'>{this._getLinePaths()}</g>
        <g className='handles'>{this._getDragHandles()}</g>
      </g>
    );
  },

  _getLinePaths: function() {
    var edge = this.props.model;

    var sourcePos = this._getSourcePos();
    var targetPos = this._getTargetPos();
    var reroutePoints = edge.getLayout().get('reroutePoints');
    return smoothCurvedEdges(sourcePos, reroutePoints, targetPos, this._addReroutePointHandler);
  },

  _getDragHandles: function() {
    var edge = this.props.model;
    var graph = this.props.container;
    var reroutePoints = edge.getLayout().get('reroutePoints');

    var sourcePos = this._getSourcePos();
    var targetPos = this._getTargetPos();

    return reroutePoints.toArray().map(function(reroutePoint, i) {
      var plain = reroutePoint.getAbsolute(sourcePos, targetPos);
      return (<circle
        className='handle'
        ref={'handle_' + i}
        key={i}
        onMouseDown={mouseDownDrag.bind(
          this, 'handle_' + i,
          this._handleRerouteDragStart,
          this._handleRerouteDragEnd.bind(this, i),
          this._handleRerouteDrag.bind(this, reroutePoint, i)
          )}
        r={HANDLE_RADIUS}
        cx={plain.x} cy={plain.y} />);
    }, this);
  },

  _handleRerouteDragStart: function() {
    // Keep a flag if it was actually dragged during the drag operation.
    // If not, it looks like a click and we'll delete the point.

    this.setState({
      rerouteDragged: false
    });
  },

  _handleRerouteDragEnd: function(i) {
    if (!this.state.rerouteDragged) {
      this.props.model.getLayout().get('reroutePoints').remove(i);
    }
  },

  _handleRerouteDrag: function(reroutePoint, index, e) {
    var sourcePos = this._getSourcePos();
    var targetPos = this._getTargetPos();

    var element = this.refs['handle_' + index].getDOMNode();
    // transform coordinates into local space. Much more accurate than using event's movement[X|Y] which tends to stray.
    var localCoordinates = globalToLocalCoordinates(e.clientX, e.clientY, element);

    reroutePoint.updateFromAbsolute(localCoordinates.x, localCoordinates.y, sourcePos, targetPos);

    this.setState({
      rerouteDragged: true
    });
  },

  _getPseudoPorts: function() {
    // ParentPorts that are actually not in the current graph
    var sourcePos = this._getSourcePos();
    var targetPos = this._getTargetPos();
    var props = {};

    if (sourcePos.pseudoPort) {
      props.model = this.props.model.get('from');
      props.x = sourcePos.x;
      props.y = sourcePos.y;
      return React.createElement(ParentPort, props);
    }
    if (targetPos.pseudoPort) {
      props.model = this.props.model.get('to');
      props.x = targetPos.x;
      props.y = targetPos.y;
      return React.createElement(ParentPort, props);
    }

    return null;
  },

  _getSourcePos: function() {
    var position = this.props.model.getStartPositionIn(this.props.container);
    if (position === null) {
      var otherPort = this.props.model.getEndPositionIn(this.props.container);
      position = getPointDistanceFromPoint(PSEUDO_PORT_DISTANCE, otherPort);
      position.angle = Math.PI;
      position.pseudoPort = true;
    }
    return position;
  },

  _getTargetPos: function() {
    var position = this.props.model.getEndPositionIn(this.props.container);
    if (position === null) {
      var otherPort = this.props.model.getStartPositionIn(this.props.container);
      position = getPointDistanceFromPoint(PSEUDO_PORT_DISTANCE, otherPort);
      position.angle = Math.PI;
      position.pseudoPort = true;
    }
    return position;
  }
});

getPointDistanceFromPoint = function(distance, point) {
  return {
    x: point.x + distance * Math.cos(point.angle),
    y: point.y - distance * Math.sin(point.angle)
  };
};

module.exports = Edge;
