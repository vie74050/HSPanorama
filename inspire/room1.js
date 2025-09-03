/*
 * Vienna Ly
 * Sep 2 2025
 * 360 spherical panorama using jquery and three.js
 * 
 * REQUIRES
 * <script src="scripts/PanoWithClickObjs.js"></script>
 */

// define hotspots

var clickobjs = [
	{
		description: "Assessor",
		pos: {x: 65, y:0, z:42.5},
		size: {x: 10, y:10, z:10}, 
		type: "circle"
	},
	{
		description: "Standardized patient",
		pos: {x: -12.5, y:-2.5, z:-67.5},
		size: {x: 10, y:10, z:10}, 
		type: "circle"
	}
];

$(document).ready(function() {
	// initial view
	lon = 10, lat = -10;	
	fov_init = 80;
	init("room1.jpg", true);
				
	$.each(clickobjs, function(i, ob){
		ClickObj(ob);
	});

	// prevent copy or saving of image from right-click menu
	$('canvas').on('contextmenu', function(e) {
		e.preventDefault();
	});



});