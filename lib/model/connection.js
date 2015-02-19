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
 * @param {Number} id - The Connection's unique identifier.
 * @param {Port} from - The Output object that is the connection's source.
 * @param {Port} to - The Input object that is the connection's target.
 * @param {Object} metadata - A standard JavaScript object containing key-value metadata.
 */
var Connection = function(id, from, to, metadata) {
  this._id = id || 0;
  this._to = to || null;
  this._from = from || null;
  this._metadata = metadata || {};
};

/**
 * Getter method for the id property.
 * @method getId
 * @returns {Number} The connection's id.
 */
Connection.prototype.getId = function() {
  return this._id;
};

/**
 * Getter method for the to property.
 * @method getTo
 * @returns {Port} The target (input) port.
 */
Connection.prototype.getTo = function() {
  return this._to;
};

/**
 * Getter method for the from property.
 * @method getFrom
 * @returns {Port} The source (output) port.
 */
Connection.prototype.getFrom = function() {
  return this._from;
};

// Make the Connection object available to other modules.
module.exports = Connection;
