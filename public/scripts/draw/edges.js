/**
 * Provides the d3 component to draw all the edges.
 * @module golle-draw-edges
 */
YUI.add('golle-draw-edges', function(Y) {
  var yuiToD3 = function(yNode) {
    return d3.select('#'+yNode.generateID());
  };
  Y.namespace('GOLLE.Draw').Edges = function() {

    //////////////
    // Defaults //
    //////////////

    var myDefs;
    var zoomContainer = null;

    /**
     * @class Edges
     * @namespace GOLLE.Draw
     */
    var chart = function(edges) {

      var enterSel = edges.enter()
        .append('g')
        .attr('graphid', getPropertyFn('id'))
        .classed('edge', true)
        .append('path')
          .classed('edge-line', true);

      setupMarkers(Y.one(edges.node()).ancestor('svg'));
      // var myDefsId = Y.one(myDefs.node()).generateID();
      //TODO: Clean this up
      var arrowheadId = Y.one(myDefs.node()).one('.arrowhead').generateID();

      // This seems a bit inefficint and fragile
      edges.selectAll('.edge-line')
        .attr('d', lineFunction)
        .attr('marker-end', 'url(#'+arrowheadId+')');

      edges.exit()
        .remove();


    };

    /////////////////////
    // Drawing helpers //
    /////////////////////

    /**
     * If they don't exist, append any defs to the svg that are relevant to this chart.
     * @method setupMarkers
     * @param  {Node} svg the SVG node
     * @private
     */
    var setupMarkers = function(svg) {
      if (Y.Lang.isValue(myDefs)) {
        return;
      }
      // refy="10" refx="20" markerHeight="20" markerWidth="20"
      // <path d="M0,0 L20,10 L0,20"></path>
      myDefs = yuiToD3(svg)
        .append('svg:defs')
        .classed('edges-defs', true);

      myDefs.append('svg:marker')
        .classed('arrowhead', true)
        .attr('markerWidth', 20)
        .attr('markerHeight', 20)
        .attr('refX', 20) // Capitalization matters
        .attr('refY', 10)
        .attr('orient', 'auto')
        .append('svg:path')
          .attr('d', 'M0,0 L20,10 L0,20');
    };

    /**
     * Get the d attribute for an svg path for an edge.
     * 
     * @method lineFunction
     * @param  {Object} d the edge datum
     * @return {String} the d attribute for a path
     * @private
     */
    var lineFunction = function(d, i) {
      var line = this;
      var sourcePos = getIOPosition(d.source);
      var targetPos = getIOPosition(d.target);

      var xDist = targetPos.cx - sourcePos.cx;
      var yDist = targetPos.cy - sourcePos.cy;

      // is the major axis the x axis?
      var majorAxisX = Math.abs(xDist) > Math.abs(yDist);

      // the midpoint on the minor axis
      var minorMiddle = (majorAxisX ? targetPos.cy + sourcePos.cy : targetPos.cx + sourcePos.cx)/2;

      var points = {
        x1: sourcePos.cx,
        y1: sourcePos.cy,

        ctrl1x: majorAxisX ? sourcePos.cx : minorMiddle,
        ctrl1y: majorAxisX ? minorMiddle : sourcePos.cy,

        ctrl2x: majorAxisX ? targetPos.cx : minorMiddle,
        ctrl2y: majorAxisX ? minorMiddle : targetPos.cy,

        x2: targetPos.cx,
        y2: targetPos.cy
      };

      return Y.Lang.sub('M{x1},{y1} C{ctrl1x},{ctrl1y},{ctrl2x},{ctrl2y},{x2},{y2}', points);
    };


    //////////////////
    // Misc helpers //
    //////////////////

    var getPropertyFn = function(name) {
      return function(d) {
        return d[name];
      };
    };

    /**
     * Get the center of an IO (or any graph element for that matter)
     * in the coordinate space of a the chart's zoom container (set by `zoomContainer` accessor)
     * @method getIOPosition
     * @param  {String} graphId
     * @return {Object}
     * @private
     */
    var getIOPosition = function(graphId) {

      var offsets = {x: 0, y: 0, scale: 1};

      if (zoomContainer) {
        var referenceContainer = Y.one(zoomContainer);

        var transformStr = referenceContainer.getAttribute('transform');

        if (transformStr) {
          var translateMatch = /translate\(([-\d\.]+), *([-\d\.]+)\)/.exec(transformStr);
          var scaleMatch = /scale\(([\d\.]+)\)/.exec(transformStr);
          offsets.x = +translateMatch[1];
          offsets.y = +translateMatch[2];
          offsets.scale = +scaleMatch[1];
        }
      }

      var element = Y.one('[graphid="' + graphId + '"] > circle');
      var elPos = element.getDOMNode().getBoundingClientRect();

      var vp = element.ancestor('svg', true);
      var vpPos = vp.getDOMNode().getBoundingClientRect();
      return {
        cx: (elPos.left - vpPos.left + elPos.width/2 - offsets.x)/offsets.scale,
        cy: (elPos.top - vpPos.top + elPos.height/2 - offsets.y)/offsets.scale
      };
    };

    ///////////////
    // Accessors //
    ///////////////

    /**
     * Set or get the outer container which is transformed. 
     * Used to get local coordinate space coordinate.
     *
     * It is expected to have scale and translate transforms.
     * @method zoomContainer
     * @param  {HTMLElement|String} value
     * @return {HTMLElement}
     */
    chart.zoomContainer = function(value) {
      if (arguments.length === 0) {
        return zoomContainer;
      }
      
      zoomContainer = value;
      
      return chart;
    };

    return chart;
  };

}, '1.0', {
  requires:[
  ]
});