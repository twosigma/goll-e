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
var vertices;
var mGraph;


//Based partially on https://code.google.com/p/jung/source/browse/branches/guava/jung/jung-algorithms/src/main/java/edu/uci/ics/jung/algorithms/layout/SpringLayout.java?r=19

function layOutGraph(graph) {
	mGraph = graph;
	vertices = graph.get('vertices');
	var edgeList = graph.get('edges');
	var runner = true;
	//var loopCount =0;
	while(runner){
		//console.log('loop count is: '+loopCount+'\n');
		change = false;
		
		for(var i=0;i<edgeList.length;i++){
			springForce(edgeList[i]);
		}
		if(change === false){
			runner = false;
		}
		//loopCount++;
	}
	//defaulting all ports that do not have a position
	for(var j=0;j < vertices.length; j++){
		var inputs = vertices[j].get('inputs');
		var outputs = vertices[j].get('outputs');
		
		for(var h =0; h < inputs.length; h++){
			
			if(inputs[h].get('position') === null){
				inputs[h].set('position', new cardinalPortPosition('E', 50));
			}
			
		}
		for(h =0;h < outputs.length; h++){
			if(outputs[h].get('position') === null){
				outputs[h].set('position', new cardinalPortPosition('W', 50));
			}
		}
	}
	
	for(var b=0;b<vertices.length; b++){
		console.log(vertices[b].get('position').x+','+vertices[b].get('position').y);
	}

}

function springForce(edge){
	//vertex to
	var vt = mGraph.getVertexById(edge.get('to').get('ownerVertexId'));
	//vertex from
	var vf = mGraph.getVertexById(edge.get('from').get('ownerVertexId'));
	//x distance between them
	var xL = edgeXLength(edge);
	//y distance between them
	var yL = edgeYLength(edge);
	//straight line edge length
	var length = edgeLength(edge);
	//checks for both pined
	if(vt.get('isPinned') ===true && vf.get('isPinned')===true){
		return;
	}
	
	//hacky solution for length being 0
	if(length === 0){
		length = 0.0001;
	}
	//repulsion force calculation
	var force = forceStr * (iLength - length) / length;
	force = force * Math.pow(stretchForce, (vt.get('inputs').length + vt.get('outputs').length + vf.get('inputs').length + vf.get('outputs').length - 4));
	
	//repulsion change in x
	var cx = force * xL;
	//repulsion change in y
	var cy = force * yL;
	//attraction x
	var dx;
	//attraction y
	var dy;
	//math for min length
	if(length < 1){
		dx = Math.random()*10+1;
		dy = Math.random()*10+1;
	} else {
		dx = xL/(length*length);
		dy = yL/(length*length);
	}
	
	var len = dx * dx + dy * dy;
	//ensures length is positive
	if(len>0){
		len = Math.sqrt(len);
		dx = dx / len;
		dy = dy / len;
	}
	//repulsion minus attraction
	cx = cx - dx;
	cy = cy - dy;
	if(vt.get('isPinned') ===false && vf.get('isPinned')===false){
		vt.set('position', {'x': (vt.get('position').x+cx),'y': (vt.get('position').y+cy)});
		vf.set('position', {'x':vf.get('position').x-cx, 'y':vf.get('position').y-cy});

		if(cx > 1 || cy > 1){
			change = true;
		}
	}else if(vt.get('isPinned') ===true){
		vf.set('position', {'x':vf.get('position').x-cx-cx, 'y':vf.get('position').y-cy-cy});
		
		if(cx > 1 || cy > 1){
			change = true;
		}
	
	}else if(vf.get('isPinned')===true){
		vt.set('position', {'x': (vt.get('position').x+cx),'y': (vt.get('position').y+cy)});
		
		if(cx > 1 || cy > 1){
			change = true;
		}
	}
}
/* not yet implemented
function portPositioning(edge){
	var vt = mGraph.getVertexById(edge.get('to').get('ownerVertexId'));
	var vf = mGraph.getVertexById(edge.get('from').get('ownerVertexId'));
	var xL = edgeXLength(edge);
	var yL = edgeYLength(edge);
	


}*/

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