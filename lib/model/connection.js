/**
 * connection.js
 * @author Salvador Abate
 * Definition for the Connection class. A Connection is the linkage between a
 * Node's Output and another (potentially different) node's Input.
 *
 * Alternatively, in the situation where a node is contained within another node,
 * the containee can have a connection from one of its Outputs to one of the
 * container's Outputs. The same applies for Inputs.
 */

/**
 * Creates a new connection.
 * @constructor
 *
 * @param id - The Connection's unique identifier.
 * @param from - The Output object that is the connection's source.
 * @param to - The Input object that is the connection's target.
 * @param metadata - A standard JavaScript object containing key-value metadata.
 */
var Connection = function(id, from, to, metadata) {
  "use strict";

  this._id = id || 0;
  this._to = to || null;
  this._from = from || null;
  this._metadata = metadata || {};
};

/**
 * @method getId - Getter method for the id property.
 */
Connection.prototype.getId = function() {
  "use strict";
  return this._id;
};

/**
 * @method getTo - Getter method for the to property.
 */
Connection.prototype.getTo = function() {
  "use strict";
  return this._to;
};

/**
 * @method getFrom - Getter method for the from property.
 */
Connection.prototype.getFrom = function() {
  "use strict";
  return this._from;
};

// Make the Connection object available to other modules.
module.exports = Connection;
