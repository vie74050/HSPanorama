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
		description: '<h3>Assessor Role</h3><Click the Play button to hear from an Assessor.<br>For more details, be sure to visit the <b>Working with Assessors</b> module found later in this course.',
		pos: {x: 65, y:0, z:42.5},
		size: {x: 10, y:10, z:10}, 
		type: "circle",
		vid: "vids/assessor"
	},
	{
		description: '<h3>Standardized Patient Role</h3>Click the Play button to hear from a Standardized Patient.<br>For more details, be sure to visit the <b>Working with Standardized Patients</b> module.',
		pos: {x: -12.5, y:-2.5, z:-67.5},
		size: {x: 10, y:10, z:10}, 
		type: "circle",
		vid: "vids/sp"
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