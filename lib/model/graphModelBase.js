var Lang = require('../utilities/lang');
var ObjectUtils = require('../utilities/objects');
var createClass = require('./../utilities/createClass');

var SCOPE_SYMBOLS = {
  NODE: '>',
  INPUT: '+',
  OUTPUT: '-'
};

var INVALID_ID_CHARS = ObjectUtils.values(SCOPE_SYMBOLS);

// Validate scoped id
var validateId = function(id) {
  if (!Lang.isValue(id)) {
    console.warn('Id must be defined');
  }

  if (!(Lang.isString(id) || Lang.isNumber(id))) {
    console.warn('Id must be a string or number');
    return false;
  }

  INVALID_ID_CHARS.forEach(function(invalidChar) {
    if (String(id).indexOf(invalidChar) !== -1) {
      console.warn('Id cannot contain "' + invalidChar + '"');
      return false;
    }
  });

  return true;
};

/**
 * A base class for the Data Model for the graph
 * @attribute instance
 * @type      [type]
 */
var GraphModelBase = createClass({
  
  instance: {
    //TODO: getByGlobalId
  },

  attrs: {

    /**
     * A scoped id string for this object
     * @attribute id
     * @type {String|Number}
     * @initOnly
     */
    id: {
      validator: validateId,
      initOnly: true,
      setter: function(val) {
        return String(val);
      }
    },

    /**
     * A globally unique identifier in this Graph
     * @attribute globalId
     * @type {String}
     * @initOnly
     */
    globalId: {
      validator: Lang.isString,
      initOnly: true,
      setter: function(val) {
        return String(val);
      }
    }
  }
});

module.exports = GraphModelBase;