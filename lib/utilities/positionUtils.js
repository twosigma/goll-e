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
   * @param  {CardinalDirection} positionData.direction
   * @param  {Number} positionData.percentage in range [0, 100]
   * @return {Object} contains x,y placement with origin in top left in range [0, 1].
   */
  cardinalToCartesian: function(positionData) {
    var amount = positionData.percentage/DATA_MODEL_MULTIPLIER;

    var x;
    var y;


    switch(positionData.direction) {
      case 'N':
      return {x: amount, y: 0};
    
      case 'S':
      return {x: amount, y: 1};
     
      case 'E':
      return {x: 1, y: amount};
      
      case 'W':
      return {x: 0, y: amount};
      
      default:
      throw 'Invalid direction'; 
    }

  }
};

module.exports = PositionUtils;