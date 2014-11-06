/**
 * The module containing the GraphWidget
 * @module golle-widget-graph
 */
YUI.add('golle-widget-graphwidget', function(Y) {

  var yuiToD3 = function(yNode) {
    return d3.select('#'+yNode.generateID());
  };
  /**
   * The `GraphWidget` is the top level Widget and corresponding DOM node for the graph and the top `<svg>` node. 
   * Its key attrs are the scale and origin attrs which should probably be set by some other navigation widgets 
   * (think GMaps's controls and/or a birds-eye view)
   * 
   * It is also responsible for creating the D3 Selections and setting data on them. 
   * Data probably comes from using {{#crossLink "Model/toJSON:method"}}{{/crossLink}}.
   * 
   * @class Widgets.GraphWidget
   * @namespace GOLLE
   * @extends Widget
   * @contructor
   */
  var GraphWidget =
  Y.namespace('GOLLE.Widget').GraphWidget =
  Y.Base.create('Widget.GraphWidget', Y.Widget, [], {

    initializer: function() {
      this._nodeChart = Y.GOLLE.Draw.Nodes();
      this._edgeChart = Y.GOLLE.Draw.Edges();

      this._d3Zoom = d3.behavior.zoom();
    },

    /* override */
    renderUI: function() {
      var cb = this.get('contentBox');

      this._svg = cb.appendChild('<svg>')
        .setStyles({width: '100%', height: '100%'});

      this._outerContainer = yuiToD3(this._svg)
        .append('g')
        .style('pointer-events', 'all')
        .call(this._d3Zoom);

      this._d3ZoomContainer = this._outerContainer
        .append('g')
        .classed('zoom-container', true);

      this._edgeChart.zoomContainer(this._d3ZoomContainer.node());

      // catches (some) mouse events
      this._outerContainer.append('rect')
        .classed('mouse-catcher', true)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .attr('width', '100%')
        .attr('height', '100%');
    },

    /* override */
    bindUI: function() {

      this.after('dataChange', this.syncUI, this);

      this._d3Zoom.on('zoom', Y.bind(this._handleD3Zoom, this));
    },

    /* override */
    syncUI: function() {
      var container = this._d3ZoomContainer;
      var idKeyFn = function(d) {
          return d.id;
        };

      var nodeSelection = container.selectAll('.node')
        .data(this._getNodeData(), idKeyFn)
        .call(this._nodeChart);

      var edgeSelection = container.selectAll('.edge')
        .data(this._getEdgeData(), idKeyFn)
        .call(this._edgeChart);
    },

    // _getViewbox: function() {
    //   // TODO
    //   return '';
    // },

    /**
     * Get the data to bind to nodes
     * @method  _getNodeData
     * @private
     * @return  {Array}
     */
    _getNodeData: function() {

      return this.get('data').nodes;

      // Below is random node generation for testing
      // TODO: This is test data
      var random = function(max) {
        return Math.floor(Math.random() * max);
      };

      var prefixIds = function(prefix, objects) {
        objects = Y.clone(objects);
        Y.Array.each(objects, function(element) {
          if (!element.id) {
            return;
          }
          element.id = prefix + element.id;
        });
        return objects;
      };

      inputs = [
        {id: 'input-a', label: 'Alpha'},
        {id: 'input-b', label: 'Beta'}
      ];
      outputs = [
        {id: 'output-g', label: 'Gamma'},
        {id: 'output-d', label: 'Delta'}
      ];
      var nodes = [];
      for (var i = 0; i < 3; i++) {
        nodes.push({
            id: i,
            x: random(500),
            y: random(300),
            label: 'Node ' + i,
            inputs: prefixIds(''+ i + '+', inputs),
            outputs: prefixIds(''+ i + '-', outputs)
          });
      }
      return nodes;
    },

    /**
     * Get the data to bind to edges
     * @method  _getEdgeData
     * @private
     * @return  {Array}
     */
    _getEdgeData: function() {

      return this.get('data').edges;
    },

    _handleD3Zoom: function() {
      var event = d3.event; // because D3 has the weirdest event handlers ever
      this._d3ZoomContainer.attr('transform',
        'translate(' + event.translate + ') scale(' + event.scale + ')');
    }
    

  }, {
    CSS_PREFIX: 'graph-widget',
    ATTRS:{

      data: {
        value: {nodes: [], edges: []},
        validator: Y.Lang.isObject
      }
    }
  });
}, '1.0', {
  requires:[
    'base',
    'golle-draw-nodes',
    'golle-draw-edges',
    'widget',
    'json'
  ]
});