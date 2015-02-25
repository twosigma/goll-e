var Lang = require('./../utilities/lang');
var AttrValidators = require('./../utilities/attrValidators');
var createClass = require('./../utilities/createClass');
var CardinalDirection = require('../enum/cardinalDirection');


/**
 * Defines a position of a Port using N/S/E/W and a percentage
 * 
 * @class CardinalPortPosition
 * @constructor
 * @param {CardinalDirection} config.direction
 * @param {Number} config.percentage a number in the range [0, 100] as measured from the top left corner
 */

var CardinalPortPosition = createClass({
  attrs: {
    direction: {
      validator: AttrValidators.isValueIn(CardinalDirection)
    },

    percentage: {
      validator: function(val) {
        if (!Lang.isNumber(val)) {
          return false;
        }

        return val >= 0 && val <= 100;
      }
    }
  }
});

module.exports = CardinalPortPosition;
