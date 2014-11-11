/**
* Node object class
*/

var node = function (id,styles,metadata,inputs,outputs){
	this.id = id;
	this.inputs = inputs;
	this.outputs = outputs;
	this.styles = styles;
	this.metadata = metadata;
};

//get node identifier
 node.prototype.getID = function(){
	return this.id;
};

//get inputs
node.prototype.getIns = function(){
	return this.inputs;
};

//get outputs
node.prototype.getOuts = function(){
	return this.outputs;
};

node.prototype.getMeta = function(){
	return this.metadata;
};

node.prototype.getStyles = function(){
	return this.styles;
};