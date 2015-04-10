var createClass = require('./createClass');
var Lang = require('./lang');
var QuadNode = require('./quadNode');

var maxlevel = 0;
// Inspired by http://gamedevelopment.tutsplus.com/tutorials/quick-tip-use-quadtrees-to-detect-likely-collisions-in-2d-space--gamedev-374

// Quickly append the contents of one array to another, optimized for very large arrays.
var arrayAppend = function(target, source) {
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

var Quadtree = createClass({
  constructor: function() {
    // The held list of quadNodes at this level
    this.objects = [];

    // The four subtrees which will be initialized on a split
    this.subtrees = null;

    if (this.get('level') > maxlevel) {
      maxlevel = this.get('level');
      console.log(maxlevel);
    }

  },

  instance: {
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
        // debugger;
        this._split();
      }

    },

    retrieve: function(boundingBox) {
      var returnObjects = this.objects.slice();
      if (this.subtrees !== null) {
        var subIndex = this._getIndex(boundingBox);
        if (subIndex !== -1) {
          var subResults = this.subtrees[subIndex].retrieve(boundingBox);
          arrayAppend(returnObjects, subResults);
        } else {
          this.subtrees.forEach(function(subtree) {
            arrayAppend(returnObjects, subtree.retrieve(boundingBox));
          });
        }
      }

      return returnObjects;
    },

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
    level: {
      value: 0,
      validator: Lang.isNumber,
      initOnly: true
    },

    bounds: {
      validator: function(val) {
        return 'x' in val && 'y' in val && 'width' in val && 'height' in val;
      },
      initOnly: true
    }
  },

  statics: {
    MAX_OBJECTS: 5,
    MAX_LEVELS: 6
  }
});

module.exports = Quadtree;
