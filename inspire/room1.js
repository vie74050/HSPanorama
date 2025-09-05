/*
 * Vienna Ly
 * Sep 2 2025
 * 360 spherical panorama using jquery and three.js
 * 
 * REQUIRES
 * <script src="scripts/PanoWithClickObjs.js"></script>
 */

// define hotspots
let host = "https://bcit-ltc.github.io/Inspire-Articulate360/story_content/";
var clickobjs2 = [
    {
        "id": 8,
        "description": "<h3>Assessor Role</h3><Click the Play button to hear from an Assessor.<br>For more details, be sure to visit the <b>Working with Assessors</b> module found later in this course.",
        "pos": {
            "x": 8.330124150757714,
            "y": 0.3372610157572966,
            "z": 5.49270501152866
        },
        "type": "circle",
        "size": {
            "x": 1,
            "y": 1,
            "z": 1
        },
        "vid": host + "video_6JsQcUCdgPO_22_48_960x540.mp4"
    },
    {
        "id": 11,
        "description": "<h3>Standardized Patient Role</h3>Click the Play button to hear from a Standardized Patient.<br>For more details, be sure to visit the <b>Working with Standardized Patients</b> module.",
        "pos": {
            "x": -1.9073459903148235,
            "y": -0.029216387385069376,
            "z": -9.812444562051693
        },
        "type": "circle",
        "size": {
            "x": 1,
            "y": 1,
            "z": 1
        },
        "vid": host + "video_5Yjeab7nB1m_22_48_960x540.mp4"
    },
    {
        "id": 14,
        "description": "Monitor",
        "pos": {
            "x": -6.183848556739126,
            "y": 0.16273464524174736,
            "z": -7.858269652640572
        },
        "type": "circle",
        "size": {
            "x": 1,
            "y": 1,
            "z": 1
        }
    },
    {
        "id": 17,
        "description": "Clock",
        "pos": {
            "x": -11.02410303135631,
            "y": 2.868381484009692,
            "z": -2.0631038587157366
        },
        "type": "circle",
        "size": {
            "x": 1,
            "y": 1,
            "z": 1
        }
    }
]

document.addEventListener('DOMContentLoaded', function() {
	const pano = new PanoViewer("container", "info_window", "video");
	
	// initial view
	pano.lon = 10, pano.lat = -10;	
	pano.fov_init = 80;
	pano.Init(host + "5kAzXWsVisZ_full.jpg" , true);

	clickobjs2.forEach(function(ob) {
		pano.ClickObj(ob);
	});

	// prevent copy or saving of image from right-click menu
	document.querySelectorAll('canvas').forEach(function(canvas) {
		canvas.addEventListener('contextmenu', function(e) {
			e.preventDefault();
		});
	});
});