/**
 * Provides the d3 component to draw all the nodes.
 *
 * I'm not exactly sure how to document d3's weird "function is an object in a closure" style.
 * They don't do a great job themselves.
 * @module golle-draw-nodes
 */
YUI.add('golle-draw-nodes', function(Y) {
  Y.namespace('GOLLE.Draw').Nodes = function() {

    //////////////
    // Defaults //
    //////////////
    var nodeWidth = 150;
    var nodeHeight = nodeWidth/1.6;
    var headerHeight = 35;
    var padding = 5;

    var ioRadius = 4;
    var ioSpacing = 15;
    
    /**
     * A d3 chart that draws nodes in a digraph.
     * Construct by calling as a function, not using new.
     * @class Nodes
     * @namespace GOLLE.Draw
     */
    var chart = function(nodes) {
      drawNodeBoxes(nodes);
      drawIOs(nodes, true);  //inputs
      drawIOs(nodes, false); //outputs
    };

    /////////////////////
    // Drawing helpers //
    /////////////////////

    /**
     * Draw the main body of the nodes
     * @method drawNodeBoxes
     * @param  {D3Selection} nodes
     * @private
     */
    var drawNodeBoxes = function(nodes) {
      //ENTER
      var enterSel = nodes.enter()
        .append('g')
          .classed('node', true)
          .attr('graphid', getPropertyFn('id'));


      enterSel
        .append('rect')
          .classed('node-box', true)
          .attr('height', nodeHeight)
          .attr('width', nodeWidth);

      enterSel
        .append('text')
          .classed('label', true)
          .attr('text-anchor', 'start')
          .attr('x', padding)
          .attr('y', padding + 10);

      // UPDATE + ENTER

      nodes.select('.label')
        .text(getPropertyFn('label'));

      updatePositionFn(nodes);

      // EXIT
      nodes.exit()
        .remove();
    };

    /**
     * Draw the inputs or outputs of all the nodes
     * @method drawIOs
     * @param  {D3Selection} nodes the selection of nodes
     * @param  {Boolean} isInput true for the inputs, false for the outputs
     * @private
     */
    var drawIOs = function(nodes, isInput) {
      var ioClass = isInput ? 'input' : 'output';
      var propertyName = isInput ? 'inputs' : 'outputs';

      // Select nodes and join data
      inputSel = nodes.selectAll('.io.' + ioClass)
        .data(getPropertyFn(propertyName), getPropertyFn('id'));

      // Container ENTER
      inputSelEnter = inputSel.enter()
        .append('g')
          .attr('graphid', getPropertyFn('id'))
          .classed('io ' + ioClass, true);

      // Circle ENTER
      inputSelEnter.append('circle')
        .attr('r', ioRadius)
        .attr('cx', 0)
        .attr('cy', 0);

      // Text ENTER
      var textMargin = ioRadius * 2;

      inputSelEnter.append('text')
        .classed('label', true)
        .attr('x', isInput ? textMargin : -textMargin)
        .attr('y', -1)
        .attr('text-anchor', isInput ? 'start' : 'end');

      // Container UPDATE
      inputSel
        .attr('transform', function(d, i) {
        return Y.Lang.sub('translate({x}, {y})', {
          x: isInput ? 0 : nodeWidth,
          y: i * ioSpacing + headerHeight
        });
      });

      // Text UPDATE

      // D3 lesson: must use select here to propagate updated data down. 
      // selectAll would create new groupings and lose data binding.
      inputSel.select('text.label')
        .text(getPropertyFn('label'));

      // Container EXIT
      inputSel.exit()
        .remove();
    };

    //////////////////
    // Misc helpers //
    //////////////////

    var getPropertyFn = function(name) {
      return function(d) {
        return d[name];
      };
    };

    var updatePositionFn = function(group) {
      return group
        .attr('transform', function(d) {
          return Y.Lang.sub('translate({x}, {y})', {
            x: d.x,
            y: d.y
          });
        });
    };

    ///////////////
    // Accessors //
    ///////////////

    //Example of a d3-style setter/getter

    /**
     * Set or get the nodeWidth
     * @method nodeWidth
     * @param  {Number} [value]
     * @return {Number}
     */
    chart.nodeWidth = function(value) {
      if (arguments.length === 0) {
        return nodeWidth;
      }
      if (!Y.Lang.isNumber(value)) {
        throw 'Must be a number';
      }
      nodeWidth = value;
      
      return chart;
    };

    return chart;
  };
}, '1.0', {
  requires:[
    'base'
  ]
});