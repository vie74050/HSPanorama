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

document.addEventListener('DOMContentLoaded', function() {
	const pano = new PanoViewer("container", "info_window", "video");
	
	// initial view
	pano.lon = 10, pano.lat = -10;	
	pano.fov_init = 80;
	pano.Init("room1.jpg", true);

	clickobjs.forEach(function(ob) {
		pano.ClickObj(ob);
	});

	// expose methods for events
	window.Move = function(axis, delta) {
		pano.Move(axis, delta);
	};
	window.MoveAroundY = function(theta) {
		pano.MoveAroundY(theta);
	};
	window.MoveCloser = function(delta) {
		pano.MoveCloser(delta);
	};
	// prevent copy or saving of image from right-click menu
	document.querySelectorAll('canvas').forEach(function(canvas) {
		canvas.addEventListener('contextmenu', function(e) {
			e.preventDefault();
		});
	});
});