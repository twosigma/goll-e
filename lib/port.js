/**
* port.js
*
* input/output object class. 
*/

var Port = function(id,type){
	this.id=id || 0;
	this.x=0;
	this.y=0;
	this.type=type;
};

Port.prototype.getID() = function{
	return id;
};

Port.prototype.getPos() = function{
	return [this.x,this.y];
};

Port.prototype.getType() = function{
	return this.type;
};