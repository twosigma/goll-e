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
var iLength = 100;
//force strength
var forceStr = 1.0/3.0;
//stretching force
var stretchForce  = 0.70;
var vertexes;
var mGraph;


//heavily inspired by https://github.com/dhotson/springy/blob/master/springy.js
//and https://code.google.com/p/jung/source/browse/branches/guava/jung/jung-algorithms/src/main/java/edu/uci/ics/jung/algorithms/layout/SpringLayout.java?r=19

function layOutGraph(graph) {
	mGraph = graph;
	vertexes = graph.get('vertices');
	var edgeList = graph.get('edges');
	var runner = true;
	var loopCount =0;
	while(runner){
		//console.log('loop count is: '+loopCount+'\n');
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
	var b=0;
	while(b<vertexes.length){
		console.log(vertexes[b].get('position').x+','+vertexes[b].get('position').y);
		b++;
	}

}

function springForce(edge){
	var tEdge=edge;
	var vt = mGraph.getVertexById(edge.get('to').get('ownerVertexId'));
	var vf = mGraph.getVertexById(edge.get('from').get('ownerVertexId'));
	var xL = edgeXLength(edge);
	var yL = edgeYLength(edge);
	var length = edgeLength(edge);
	
	
	//hacky solution for length being 0
	if(length === 0){
		length = 0.0001;
	}
	
	var force = forceStr * (iLength - length) / length;
	
	force = force * Math.pow(stretchForce, (vt.get('inputs').length + vt.get('outputs').length + vf.get('inputs').length + vf.get('outputs').length - 4));
	
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

	vt.set('position', {'x': (vt.get('position').x+cx),'y': (vt.get('position').y+cy)});
	vf.set('position', {'x':vf.get('position').x-cx, 'y':vf.get('position').y-cy});

	if(cx > 1 || cy > 1){
		change = true;
	}
}


//calculates edge length
function edgeLength(edge){
	to=mGraph.getVertexById(edge.get('to').get('ownerVertexId'));
	from=mGraph.getVertexById(edge.get('from').get('ownerVertexId'));
	
	if('null' !=to.get('position').x&&'null' !=to.get('position').y&&'null' !=from.get('position').x&& 'null' != from.get('position').y){
		//pythag theorem 
		var x = to.get('position').x - from.get('position').x;
		var y = to.get('position').y - from.get('position').y;
		
		var c = x*x+y*y;
		return Math.sqrt(c);
	}else{
	//@todo add error checking
	//on fail return 0 length
		return 0;
	
	}

}

function edgeXLength(edge){
	to=mGraph.getVertexById(edge.get('to').get('ownerVertexId'));
	from=mGraph.getVertexById(edge.get('from').get('ownerVertexId'));
	
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
	to=mGraph.getVertexById(edge.get('to').get('ownerVertexId'));
	from=mGraph.getVertexById(edge.get('from').get('ownerVertexId'));
	
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