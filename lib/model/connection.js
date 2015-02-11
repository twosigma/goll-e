/**
 * connection.js
 *
 * Definition for the Connection class. A Connection is the linkage between a
 * Node's Output and another (potentially different) node's Input.
 * 
 * Alternatively, in the situation where a node is contained within another node,
 * the containee can have a connection from one of it's Outputs to one of the
 * container's Outputs. The same applies for Inputs.
 */

/**
 * @constructor Constructor function.
 *
 * @param id - The Connection's unique identifier.
 * @param from - The Output object that is the connection's source.
 * @param to - The Input object that is the connection's target.
 * @param metadata - A standard JavaScript object containing key-value metadata.
 */
var Connection = function(id, from, to, metadata) {
  this._id = id || 0;
  this._to = to || null;
  this._from = from || null;
  this._metadata = metadata || null;
};

/**
 * @method Getter method for the id property.
 */
Connection.prototype.getId = function() {
  return this._id;
};

/**
 * @method Getter method for the to property.
 */
Connection.prototype.getTo = function() {
  return this._to;
};

/**
 * @method Getter method for the from property.
 */
Connection.prototype.getFrom = function() {
  return this._from;
};

// Make the Connection object available to other modules.
module.exports = Connection;
