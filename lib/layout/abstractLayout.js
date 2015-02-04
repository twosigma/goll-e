/**
 * AbstractLayout.js
 *
 * basic layout system
 *
 * @author John O'Brien.
 */

var Node = require('../model/node.js');
var Graph = require('../model/graph.js');
var Port = require('../model/port.js');
var graph;

//set of vertices that should not be moved
//@dontMove @Don't Move
var dontMove;

//@maxsize max size (render size), @defaulted to 200, this can(and probably should) be changed
var size=200;

//boolean purpose unknown, hehehheeehehehehehehehhehe
var initialized= false;


function buildGraph(nodes_and_connections) {
	



}
