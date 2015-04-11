var createClass = require('./createClass');
var Lang = require('./lang');
var QuadNode = require('./quadNode');

// Inspired by http://gamedevelopment.tutsplus.com/tutorials/quick-tip-use-quadtrees-to-detect-likely-collisions-in-2d-space--gamedev-374

var arrayAppend;

/**
 * A Quadtree is a data structure optimal for finding collisions of 2D objects in n time.
 * Objects are inserted into the tree and it can be queried in logn time.
 * It will return a few false positives which can be checked with another algorithm.
 * Each Quadtree has bounds. Objects are inserted until MAX_OBJECTS is hit,
 * then it breaks into 4 quadrant subtrees. Any objects that fit within those quadrants are pushed down the tree.
 * @class Quadtree
 */
var Quadtree = createClass({
  constructor: function() {
    // The held list of quadNodes at this level
    this.objects = [];

    // The four subtrees which will be initialized on a split
    this.subtrees = null;

  },

  instance: {
    /**
     * Insert a node into the tree.
     * @method insert
     * @param  {QuadNode} quadNode
     */
    insert: function(quadNode) {
      if (!(quadNode instanceof QuadNode)) {
        throw new Error('Can only insert a QuadNode');
      }

      var boundingBox = quadNode.get('boundingBox');

      if (this.subtrees !== null) {
        // we've split. Add to subtree if possible.
        var subIndex = this._getIndex(boundingBox);
        if (subIndex === -1) {
          // on a boundary
          this.objects.push(quadNode);
        } else {
          this.subtrees[subIndex].insert(quadNode);
        }

      } else {
        // split has not happened yet. Add to our list.
        this.objects.push(quadNode);
      }

      // time to split?
      if (this.subtrees === null && this.objects.length > Quadtree.MAX_OBJECTS &&
        this.get('level') < Quadtree.MAX_LEVELS) {
        this._split();
      }

    },

    /**
     * Get all Quadnodes that are likely to collide with the given bounding box.
     * @method retrieve
     * @param  {Object} boundingBox
     * @return {Array} array of QuadNodes
     */
    retrieve: function(boundingBox) {
      var returnObjects = this.objects.slice();
      if (this.subtrees !== null) {
        var subIndex = this._getIndex(boundingBox);
        if (subIndex !== -1) {
          var subResults = this.subtrees[subIndex].retrieve(boundingBox);
          arrayAppend(returnObjects, subResults);
        } else {
          // it's on the border. search all the subtrees.
          this.subtrees.forEach(function(subtree) {
            arrayAppend(returnObjects, subtree.retrieve(boundingBox));
          });
        }
      }

      return returnObjects;
    },

    /**
     * Break down our list of objects into subtrees.
     * We'll hold onto any objects that don't entirely fit within any of the quadants.
     * @method  _split
     * @private
     */
    _split: function() {
      var bounds = this.get('bounds');
      var level = this.get('level');
      var subWidth = bounds.width / 2;
      var subHeight = bounds.height / 2;

      this.subtrees = new Array(4);
      /*
      —————————
      | 1 | 0 |
      | 2 | 3 |
      —————————
       */

      var createWithOffset = function(xOffset, yOffset) {
        return new Quadtree({
          level: level + 1,
          bounds: {
            x: bounds.x + xOffset,
            y: bounds.y + yOffset,
            width: subWidth,
            height: subHeight
          }
        });
      };

      this.subtrees[0] = createWithOffset(subWidth, 0);
      this.subtrees[1] = createWithOffset(0, 0);
      this.subtrees[2] = createWithOffset(0, subHeight);
      this.subtrees[3] = createWithOffset(subWidth, subHeight);

      // reallocate all objects into new subtrees
      var objectsCopy = this.objects.slice();
      this.objects = [];
      objectsCopy.forEach(function(quadNode) {
        var subIndex = this._getIndex(quadNode.get('boundingBox'));
        if (subIndex === -1) {
          this.objects.push(quadNode);
        } else {
          this.subtrees[subIndex].insert(quadNode);
        }
      }, this);

    },

    /**
     * Get the index of the subtree which fully contains this bounding box.
     * Or -1 if it is not fully in any quadrant.
     * @method  _getIndex
     * @param   {Object} rect a boundingBox object
     * @private
     * @return  {Number} in range [0, 3]
     */
    _getIndex: function(rect) {
      var bounds = this.get('bounds');
      var midX = bounds.x + (bounds.width / 2);
      var midY = bounds.y + (bounds.height / 2);

      // Object can completely fit within the top quadrants
      var topHalf = rect.y + rect.height < midY;
      // Object can completely fit within the bottom quadrants
      var bottomHalf = rect.y > midY;

      var leftHalf = rect.x + rect.width < midX;
      var rightHalf = rect.x > midX;

      if (leftHalf && topHalf) {
        return 1;
      }
      if (leftHalf && bottomHalf) {
        return 2;
      }
      if (rightHalf && topHalf) {
        return 0;
      }
      if (rightHalf && bottomHalf) {
        return 3;
      }

      // doesn't completely fit in any sub-node
      return -1;
    }
  },

  attrs: {
    /**
     * How deep this tree is from the root.
     * @attribute level
     * @type Number
     */
    level: {
      value: 0,
      validator: Lang.isNumber,
      initOnly: true
    },

    /**
     * A bounding box in which all the nodes in this tree are contained.
     * Object with x, y, width, height.
     * @attribute bounds
     * @type {Object}
     */
    bounds: {
      validator: function(val) {
        return 'x' in val && 'y' in val && 'width' in val && 'height' in val;
      },
      initOnly: true
    }
  },

  statics: {
    /**
     * @property {Number} MAX_OBJECTS How many objects to hold before splitting.
     */
    MAX_OBJECTS: 5,
    /**
     * @property {Number} MAX_LEVELS How many levels deep before disallowing splitting.
     */
    MAX_LEVELS: 6
  }
});

// Quickly append the contents of one array to another, optimized for very large arrays.
arrayAppend = function(target, source) {
  if (source.length < 10000) {
    // this is great until it exceeds the call stack ~(150000 Chrome, 500000 FF)
    Array.prototype.push.apply(target, source);
  } else {
    source.unshift(source.length);
    source.unshift(target.length);
    Array.prototype.splice.apply(target, source);
    source.shift();
    source.shift();
  }
};

module.exports = Quadtree;
