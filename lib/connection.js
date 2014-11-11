/**
 * Connection object class
 */

var connection = function(id,from,to,metadata){
	this.id = id;
	this.from = from;
	this.to = to;
};

connection.prototype.getID = function(){
	return this.id;
};

connection.prototype.getTo = function(){
	return this.from;
};

cconnection.prototype.getFrom = function(){
	return this.to;
};