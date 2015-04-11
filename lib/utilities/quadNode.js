var createClass = require('./createClass');

/**
 * A node for insertion into a quadtree.
 * To make an analogy with a Heap/Priority Queue, the boundingBox is the key, and value is any arbitrary associated value.
 * @class QuadNode
 */
var QuadNode = createClass({
  attrs: {
    /**
     * Any value
     * @attribute value
     * @type      Any
     */
    value: {
      value: null,
      initOnly: true
    },

    /**
     * A rectangular bounding box. The "key" for storing in the quadtree.
     * @attribute boundingBox
     * @type      Object
     */
    boundingBox: {
      validator: function(val) {
        return 'x' in val && 'y' in val && 'width' in val && 'height' in val;
      },
      initOnly: true
    }
  }
});

module.exports = QuadNode;
