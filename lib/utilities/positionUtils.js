var CardinalDirection = require('../enum/cardinalDirection');
var CardinalPortPosition = require('../model/cardinalPortPosition');
var CartesianPortPosition = require('../model/cartesianPortPosition');
/**
 * @class PositionUtils
 * @static
 */
var PositionUtils = {};

// Data model scales values up to 0-100.
var DATA_MODEL_MULTIPLIER = 100.0;

/**
 * Utilities for converting positions between formats
 * @class PositionUtils.Conversion
 * @static
 */
PositionUtils.Conversion = {
  /**
   * Convert N/S/E/W to x, y. For placing inside some bounded object such as a Node. 
   * 
   * @method cardinalToCartesian
   * @param  {CardinalDirection} positionData
   * @return {Object} contains x,y placement with origin in top left in range [0, 1].
   */
  cardinalToCartesian: function(positionData) {
    var amount = positionData.getPercentage()/DATA_MODEL_MULTIPLIER;

    switch(positionData.getDirection()) {
      case CardinalDirection.NORTH:
      return new CartesianPortPosition(amount, 0);
    
      case CardinalDirection.SOUTH:
      return new CartesianPortPosition(amount, 1);
     
      case CardinalDirection.EAST:
      return new CartesianPortPosition(1, amount);
      
      case CardinalDirection.WEST:
      return new CartesianPortPosition(0, amount);
      
      default:
      throw 'Unsupported cardinal direction: ' + positionData.getDirection(); 
    }

  }
};

module.exports = PositionUtils;