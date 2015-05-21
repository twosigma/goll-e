var React = require('react');
var mouseDownDrag = require('../utilities/mouseDownDrag');
var Graph = require('../model/graph');
var EdgeModel = require('../model/edge');
var smoothCurvedEdges = require('./smoothCurvedEdges.jsx');
var globalToLocalCoordinates = require('../utilities/globalToLocalCoordinates');

var HANDLE_RADIUS = 7;

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
    this._rerouteAddEventHandle = props.model.get('layout').get('reroutePoints').after('add', function(e) {
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
        <g className='lines'>{this._getLinePaths()}</g>
        <g className='handles'>{this._getDragHandles()}</g>
      </g>
    );
  },

  _getLinePaths: function() {
    var edge = this.props.model;
    var graph = this.props.container;

    var sourcePos = edge.getStartPositionIn(graph);
    var targetPos = edge.getEndPositionIn(graph);
    var reroutePoints = edge.get('layout').get('reroutePoints');
    return smoothCurvedEdges(sourcePos, reroutePoints, targetPos, this._addReroutePointHandler);
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
      this.props.model.get('layout').get('reroutePoints').remove(i);
    }
  },

  _handleRerouteDrag: function(reroutePoint, index, e) {
    var edge = this.props.model;
    var graph = this.props.container;

    var sourcePos = edge.getStartPositionIn(graph);
    var targetPos = edge.getEndPositionIn(graph);

    var element = this.refs['handle_' + index].getDOMNode();
    // transform coordinates into local space. Much more accurate than using event's movement[X|Y] which tends to stray.
    var localCoordinates = globalToLocalCoordinates(e.clientX, e.clientY, element);

    reroutePoint.updateFromAbsolute(localCoordinates.x, localCoordinates.y, sourcePos, targetPos);

    this.setState({
      rerouteDragged: true
    });
  }
});


module.exports = Edge;
