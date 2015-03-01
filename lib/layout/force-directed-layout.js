/**
 * force-directed-layout.js
 *
 * This module contains logic for performing the force-directed layout
 * algorithm on a graph.
 *
 * @author John O'Brien.
 */

var Graph = require('./../model/graph');
var Vertex = require('./../model/vertex');
var Port = require('./../model/port');
var Edge = require('./../model/edge');
var CardinalPortPosition = require('./../model/cardinalPortPosition');
var change = false;
//ideal length
var iLength = 50;
//force strength
var forceStr = 1.0/3.0;
//stretching force
var strechForce  = 0.70;


//heavily inspired by https://github.com/dhotson/springy/blob/master/springy.js
//and https://code.google.com/p/jung/source/browse/branches/guava/jung/jung-algorithms/src/main/java/edu/uci/ics/jung/algorithms/layout/SpringLayout.java?r=19

function layOutGraph(graph) {
	console.log('begin');
	console.log(graph.get('vertices').length);
	console.log(graph.get('edges')[0].getId);
	var vertexes = graph.get('vertices');
	var stiffness = 400.0;
	var repulsion = 400.0;
	var damping = 0.5;
	var minEnergyThreshold = 0.00001;
	var edgeList = graph.get('edges');
	var springList =[];
	var tEdge;
	var runner = true;
	
	console.log(edgeList.length);
	console.log('begin 2');
	for(tEdge in edgeList){
		console.log(tEdge.getId);
		tEdge.getTo.getOwner().upDegree();
		tEdge.getFrom.getOwner().upDegree();

	}
	console.log('Loop 1 down');
	var loopCount =0;
	while(runner){
		console.log('loop count is: '+loopCount+'\n');
		change = false;
		for(tEdge in edgeList){
			springForce(tEdge);
		}
		if(change === false){
			runner = false;
		}
		loopCount++;
	}
	

}

function springForce(edge){
	var tEdge;
	for(tEdge in edgeList){
		var vt = tEdge.getTo.getOwner();
		var vf = tEdge.getFrom.getOwner();
		var xL = edgeXLength(tEdge);
		var yL = edgeYLength(tEdge);
		var length = edgeLength(tEdge);
		//hacky solution for length being 0
		if(length === 0){
			length = 0.0001;
		}
		var force = forceStr * (iLength - length) / length;
		force = force * Math.pow(stretch, (vt.getDegree() + vf.getDegree() - 2));
		
		var cx = force * xL;
		var cy = force * yL;
		var dx;
		var dy;
		if(length === 0.0001){
			dx = Math.random()*10+1;
			dy = Math.random()*10+1;
	
		} else {
			dx = xL/(length*length);
			dy = yL/(length*length);
		}
		var len = dx * dx + dy * dy;
		if(len>0){
			len = Math.sqrt(len);
			dx = dx / len;
			dy = dy / len;
		}
		cx = cx - dx;
		cy = cy - dy;
		vt.setPosition(vt.getPosition().x+cx,vt.getPosition().y+cy);
		vf.setPosition(vf.getPosition().x-cx,vf.getPosition().y-cy);
		if(cx > 1 || cy > 1){
			changed = true;
		}
	}

}

function stretch(edge){
	var vt = tEdge.getTo.getOwner();
	var vf = tEdge.getFrom.getOwner();
	var xL = edgeXLength(tEdge);
	var yL = edgeYLength(tEdge);
	var length = edgeLength(tEdge);
	

}

function tick(){
		this.applyCoulombsLaw();
		this.applyHookesLaw();
		this.attractToCentre();
		this.updateVelocity(timestep);
		this.updatePosition(timestep);
}

function spring(edge ,springList){
	if(!(edge in springList)){
		
		
	}
}
//calculates edge length
function edgeLength(edge){
	to=edge.getTo.getOwner();
	from=edge.getFrom.getOwner();
	if('null' !=to.getPosition().x&&'null' !=to.getPosition().y()&&'null' !=from.getPosition().x()&&'null' !=from.getPosition().y){
		//pythag theorem 
		var x = to.getPosition().x - from.getPosition().x;
		var y = to.getPosition().y - from.getPosition().y;
		var c = x*x+y*y;
		return Math.sqrt(c);
	}else{
	//@todo add error checking
	//on fail return 0 length
		return 0;
	
	}

}

function edgeXLength(edge){
	to=edge.getTo.getOwner();
	from=edge.getFrom.getOwner();
	if('null' !=to.getPosition().x&&'null' !=from.getPosition().x()){
		var x = to.getPosition().x - from.getPosition().x;
		return x;
	}else{
	//@todo add error checking
	//on fail return 0 length
		return 0;
	
	}

}

function edgeYLength(edge){
	to=edge.getTo.getOwner();
	from=edge.getFrom.getOwner();
	if('null' !=to.getPosition().y()&&'null' !=from.getPosition().y){
		var y = to.getPosition().y - from.getPosition().y;
		return y;
	}else{
	//@todo add error checking
	//on fail return 0 length
		return 0;
	
	}

}
module.exports = layOutGraph;