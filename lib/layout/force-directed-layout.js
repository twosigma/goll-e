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
var vertexes;


//heavily inspired by https://github.com/dhotson/springy/blob/master/springy.js
//and https://code.google.com/p/jung/source/browse/branches/guava/jung/jung-algorithms/src/main/java/edu/uci/ics/jung/algorithms/layout/SpringLayout.java?r=19

function layOutGraph(graph) {
	console.log('begin');
	console.log(graph.get('vertices').length);
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
		if(change === false){
			runner = false;
		}
		loopCount++;
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
		console.log('Bravo');
		var force = forceStr * (iLength - length) / length;
		console.log('Bravo2');
		force = force * Math.pow(stretch, (vt.get('inputs').length + vt.get('outputs').length + vf.get('inputs').length + vf.get('outputs').length - 4));
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
		vt.set('position', [vt.get('position')[0]+cx,vt.get('position')[1]+cy]);
		vf.set('position', [vf.get('position')[0]-cx,vf.get('position')[1]-cy]);
		console.log('Echo');
		if(cx > 1 || cy > 1){
			changed = true;
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
	if('null' !=to.get('position')[0]&&'null' !=to.get('position')[1]&&'null' !=from.get('position')[0]&& 'null' != from.get('position')[1]){
		//pythag theorem 
		console.log('Alpha3Charlie2');
		var x = to.get('position')[0] - from.get('position')[0];
		console.log('Alpha3Charlie3');
		var y = to.get('position')[1] - from.get('position')[1];
		console.log('Alpha3Charlie4');
		var c = x*x+y*y;
		console.log('Alpha3Charlie5');
		return Math.sqrt(c);
	}else{
	//@todo add error checking
	//on fail return 0 length
		return 0;
	
	}

}

function edgeXLength(edge){
	to=vertexes[edge.get('to').get('ownerVertexId')];
	from=vertexes[edge.get('from').get('ownerVertexId')];
	if('null' !=to.get('position')[0]&&'null' !=from.get('position')[0]){
		var x = to.get('position')[0] - from.get('position')[0];
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
	if('null' !=to.get('position')[1]&&'null' !=from.get('position')[1]){
		var y = to.get('position')[1] - from.get('position')[1];
		return y;
	}else{
	//@todo add error checking
	//on fail return 0 length
		return 0;
	
	}

}
module.exports = layOutGraph;