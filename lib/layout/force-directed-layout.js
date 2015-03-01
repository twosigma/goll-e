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
var stretchForce  = 0.70;
var vertexes;


//heavily inspired by https://github.com/dhotson/springy/blob/master/springy.js
//and https://code.google.com/p/jung/source/browse/branches/guava/jung/jung-algorithms/src/main/java/edu/uci/ics/jung/algorithms/layout/SpringLayout.java?r=19

function layOutGraph(graph) {
	console.log('begin');
	//console.log(graph.get('vertices')[0].get('position'));
	//console.log(graph.get('edges')[0].get('to'));
	vertexes = graph.get('vertices');
	var stiffness = 400.0;
	var repulsion = 400.0;
	var damping = 0.5;
	var minEnergyThreshold = 0.00001;
	var edgeList = graph.get('edges');
	var springList =[];
	var tEdge;
	var runner = true;
	//console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
	//console.log(edgeList[0].get('to'));
	console.log('begin 2');
	/*for(tEdge in edgeList){
		console.log(tEdge.getId);
		tEdge.get('to').get('ownerVertexId').upDegree();
		tEdge.get('from').get('ownerVertexId').upDegree();

	}*/
	console.log('Loop 1 down');
	var loopCount =0;
	while(runner){
		console.log('loop count is: '+loopCount+'\n');
		change = false;
		var i=0;
		while(i<edgeList.length){
			springForce(edgeList[i]);
			i++;
		}
		console.log(change);
		if(change === false){
			runner = false;
		}
		loopCount++;
	}
	var b=0;
	while(b<vertexes.length){
		console.log(vertexes[b].get('position').x+','+vertexes[b].get('position').y);
		b++;
	}

}

function springForce(edge){
	var tEdge=edge;
	//for(tEdge in edgeList){
	
		console.log('Alpha');
		//console.log(edge.get('to'));
		var vt = vertexes[tEdge.get('to').get('ownerVertexId')];
		console.log('Alpha2');
		var vf = vertexes[tEdge.get('from').get('ownerVertexId')];
		console.log('Alpha3');
		var xL = edgeXLength(tEdge);
		var yL = edgeYLength(tEdge);
		var length = edgeLength(tEdge);
		//hacky solution for length being 0
		if(length === 0){
			length = 0.0001;
		}
		//console.log(length);
		console.log('Bravo');
		var force = forceStr * (iLength - length) / length;
		//console.log((iLength - length));
		//console.log((iLength - length)/length);
		//console.log(force);
		console.log('Bravo2');
		console.log(vt.get('inputs').length);
		console.log( vt.get('outputs').length);
		console.log(vf.get('inputs').length);
		console.log(vf.get('outputs').length);
		console.log(stretch);
		force = force * Math.pow(stretchForce, (vt.get('inputs').length + vt.get('outputs').length + vf.get('inputs').length + vf.get('outputs').length - 4));
		console.log(force);
		console.log('Bravo3');
		var cx = force * xL;
		var cy = force * yL;
		var dx;
		var dy;
		
		
		console.log('Charlie');
		if(length === 0.0001){
			dx = Math.random()*10+1;
			dy = Math.random()*10+1;
	
		} else {
			dx = xL/(length*length);
			dy = yL/(length*length);
		}
		var len = dx * dx + dy * dy;
		console.log('Delta');
		if(len>0){
			len = Math.sqrt(len);
			dx = dx / len;
			dy = dy / len;
		}
		cx = cx - dx;
		cy = cy - dy;
		console.log('cx:'+(cx>1));
		console.log('cy:'+cy);
		console.log(vt.get('position').x+cx+','+vt.get('position').y+cy);
		vt.set('position', {'x': (vt.get('position').x+cx),'y': (vt.get('position').y+cy)});
		vf.set('position', {'x':vf.get('position').x-cx, 'y':vf.get('position').y-cy});
		console.log('Echo');
		if(cx > 1 || cy > 1){
			change = true;
		}
	//}

}

function stretch(edge){
	var vt = tEdge.get('to').get('ownerVertexId');
	var vf = tEdge.get('from').get('ownerVertexId');
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
	to=vertexes[edge.get('to').get('ownerVertexId')];
	from=vertexes[edge.get('from').get('ownerVertexId')];
	console.log('Alpha3Charlie1');
	if('null' !=to.get('position').x&&'null' !=to.get('position').y&&'null' !=from.get('position').x&& 'null' != from.get('position').y){
		//pythag theorem 
		//console.log('Alpha3Charlie2\n'+to.get('position').x+'\n'+from.get('position').x);
		var x = to.get('position').x - from.get('position').x;
		//console.log('Alpha3Charlie3');
		var y = to.get('position').y - from.get('position').y;
		//console.log('Alpha3Charlie4');
		
		var c = x*x+y*y;
		//console.log('Alpha3Charlie5');
		return Math.sqrt(c);
	}else{
	//@todo add error checking
	//on fail return 0 length
		return 0.001;
	
	}

}

function edgeXLength(edge){
	to=vertexes[edge.get('to').get('ownerVertexId')];
	from=vertexes[edge.get('from').get('ownerVertexId')];
	if('null' !=to.get('position').x&&'null' !=from.get('position').x){
		var x = to.get('position').x - from.get('position').x;
		return x;
	}else{
	//@todo add error checking
	//on fail return 0 length
		return 0;
	
	}

}

function edgeYLength(edge){
	to=vertexes[edge.get('to').get('ownerVertexId')];
	from=vertexes[edge.get('from').get('ownerVertexId')];
	if('null' !=to.get('position').y&&'null' !=from.get('position').y){
		var y = to.get('position').y - from.get('position').y;
		return y;
	}else{
	//@todo add error checking
	//on fail return 0 length
		return 0;
	
	}

}
module.exports = layOutGraph;