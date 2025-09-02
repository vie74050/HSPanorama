/*
 * Vienna Ly
 * Dec 8, 2015
 * 360 spherical panorama using jquery and three.js
 */



$(document).ready(function() {
	
	var mat, panoSize, ratio_wh,
	$info_window;

	var CAMERA, SCENE, RENDERER, PROJECTOR, SELECTED;
	var offset = new THREE.Vector3(),
		OBJECTS = [], PLANE, MOUSE2D;
	
	/* SET PANO PARMETERS */			
	var fov = 40, 
		texture_placeholder,
		isUserInteracting = false,
		lon = 90, lat = 0, 
		phi = 0, theta = 0;
	
	
	/* SET HOTSPOTS */
	var A1 = "<b class='handle'>Ultrasonic Flow Transmitter  - A1</b>";
	var A2 = "<b class='handle'>Ultrasonic Flow Sensor - A2</b>";
	var B = "<b class='handle'>Orifice Plate Flow Sensor - B</b>";
	var C = "<b class='handle'>Coriolis Flowmeter - C</b>";
	var D = "<b class='handle'>D/P Transmitter for Orifice Plate Flow Sensor - D</b>";
	var E = "<b class='handle'>Vortex Shedding Flowmeter - E</b>";
	var F = "<b class='handle'>Unguided Radar Level Transmitter - F</b>";
	var G = "<b class='handle'>Capacitance Level Transmitter - G</b>";
	var H = "<b class='handle'>Mag Flow Transmitter - H</b>";
	var J = "<b class='handle'>Temperature Transmitter - J</b>";
	var K = "<b class='handle'>D/P Level Transmitter - K</b>";
	var L = "<b class='handle'>Ultrasonic Level Transmitter - L</b>";
	var M = "<b class='handle'>Guided Radar Level Transmitter - M</b>";
	var N = "<b class='handle'>Control Valves - N</b>";
	
	// click objects - e.g define params	
	var clickobjs = [
		// STATION 1 AND 2
		{
			description:  A1,
			pos: {x: -16.5, y:4, z:30},
			size: {x: 1, y:1, z:1}, 
			type: "sphere",
			vid: "ultrasonic"
		},
		{
			description:  A1,
			pos: {x: 10.5, y:4.5, z:30},
			size: {x: 1, y:1, z:1}, 
			type: "sphere",
			vid: "ultrasonic"
		},
		
		{
			description:  A2,
			pos: {x: -12.5, y:5, z:30},
			size: {x: .8, y:.6, z:1}, 
			type: "sphere",
			vid: "ultrasonic"
		},
		
		{
			description:C,
			pos: {x: -24, y:-4.5, z:30},
			size: {x: 0.7, y:0.3, z:1}, 
			type: "sphere",
			vid: "coriolis"
		
		},
		{
			description:C,
			pos: {x: 17.6, y:-4, z:30},
			size: {x: 0.7, y:0.3, z:1}, 
			type: "sphere",
			vid: "coriolis"
		
		},
		
		{
			description:D,
			pos: {x: -22, y:-5.5, z:30},
			size: {x: 0.6, y:0.3, z:1}, 
			type: "sphere",
			vid: "dpflow"
		
		},
		{
			description:D,
			pos: {x: 18.7, y:-5.3, z:30},
			size: {x: 0.6, y:0.3, z:1}, 
			type: "sphere",
			vid: "dpflow"
		
		},
		
		{
			description: E,
			pos: {x: -23.7, y:-2.7, z:30},
			size: {x: 0.6, y:0.6, z:1}, 
			type: "sphere",
			vid: "vortex"
		
		},
		{
			description: E,
			pos: {x: 18.7, y:-2.3, z:30},
			size: {x: 0.6, y:0.6, z:1}, 
			type: "sphere",
			vid: "vortex"	
		},
		
		{
			description:  G,
			pos: {x: -11.5, y:7.5, z:30},
			size: {x: 1, y:1, z:1}, 
			type: "sphere"
		},
		
		{
			description: H,
			pos: {x: 7.5, y:-1, z:30},
			size: {x: 1, y: 1, z:1}, 
			type: "sphere",
			vid: "magflow"	
		},
		{
			description: H,
			pos: {x: -.9, y:-2.5, z:30},
			size: {x: 1.1, y: 1.1, z:1}, 
			type: "sphere",
			vid: "magflow"
		},
		{
			description: H,
			pos: {x: -5.3, y:-2.8, z:30},
			size: {x: 1.1, y: 1.1, z:1}, 
			type: "sphere",
			vid: "magflow"
		},
		{
			description: H,
			pos: {x: -13.8, y:-1.7, z:30},
			size: {x: 1, y: 1, z:1}, 
			type: "sphere",
			vid: "magflow"
		},
	
		
		{
			description: J,
			pos: {x: -2.2, y:3.3, z:30},
			size: {x: .7, y: .7, z:1}, 
			type: "sphere",
		},
		{
			description: J,
			pos: {x: -4.2, y:1.4, z:30},
			size: {x: .7, y: .7, z:1}, 
			type: "sphere",
		},
		
		{
			description: K,
			pos: {x: -.5, y:-7.6, z:30},
			size: {x: .7, y: .7, z:1}, 
			type: "sphere",
		},
		{
			description: K,
			pos: {x: -13.1, y:-8, z:30},
			size: {x: .7, y: .7, z:1}, 
			type: "sphere",
		},
		
		{
			description:  L,
			pos: {x: 5.3, y:7, z:30},
			size: {x: 1, y:1, z:1}, 
			type: "sphere"
		},
		
		{
			description:  N,
			pos: {x: 10.9, y:-3.2, z:30},
			size: {x: 1, y:1.5, z:1}, 
			type: "sphere"
		},
		{
			description:  N,
			pos: {x: 7.9, y:1.8, z:30},
			size: {x: 1, y:1, z:1}, 
			type: "sphere"
		},
		{
			description:  N,
			pos: {x: -17.8, y:-3.5, z:30},
			size: {x: 1, y:.7, z:1}, 
			type: "sphere"
		},
		
		// STATION 3 AND 4
		{
			
			description: A1,
			pos: {x: -30, y:3.4, z:-12.5},
			size: {x: 1, y:1, z:1}, 
			type: "sphere",
			vid: "ultrasonic"
		},
		{
			
			description: A1,
			pos: {x: -30, y:3.4, z:11.8},
			size: {x: 1, y:1, z:1}, 
			type: "sphere",
			vid: "ultrasonic"
		},
		
		{
			
			description: A2,
			pos: {x: -30, y:4.3, z:-9.2},
			size: {x: 0.6, y:0.3, z:1}, 
			type: "sphere",
			vid: "ultrasonic"
		
		},
		
		{
			description:C,
			pos: {x: -30, y:-4.2, z:-19},
			size: {x: 0.6, y:0.3, z:1}, 
			type: "sphere",
			vid: "coriolis"
		
		},
		{
			description:C,
			pos: {x: -30, y:-4.2, z:18.5},
			size: {x: 0.6, y:0.3, z:1}, 
			type: "sphere",
			vid: "coriolis"
		
		},
		
		{
			description:D,
			pos: {x: -30, y:-5.2, z:-20.6},
			size: {x: 0.6, y:0.3, z:1}, 
			type: "sphere",
			vid: "dpflow"
		
		},
		{
			description:D,
			pos: {x: -30, y:-5.2, z:17.6},
			size: {x: 0.6, y:0.3, z:1}, 
			type: "sphere",
			vid: "dpflow"
		
		},
		
		{
			description: E,
			pos: {x: -30, y:-2.7, z:-19.2},
			size: {x: 0.6, y:0.3, z:1}, 
			type: "sphere",
			vid: "vortex"
		
		},
		{
			description: E,
			pos: {x: -30, y:-2.5, z:18},
			size: {x: 0.6, y:0.3, z:1}, 
			type: "sphere",
			vid: "vortex"	
		},
		
		{
			description: H,
			pos: {x: -30, y:-2.8, z:1.7},
			size: {x: 1, y: 1, z:1}, 
			type: "sphere",
			vid: "magflow"	
		},
		{
			description: H,
			pos: {x: -30, y:-2.8, z:-2.3},
			size: {x: 1, y: 1, z:1}, 
			type: "sphere",
			vid: "magflow"
		},
		{
			description: H,
			pos: {x: -30, y:-1.8, z:9},
			size: {x: 1, y: 1, z:1}, 
			type: "sphere",
			vid: "magflow"
		},
		
		{
			description: J,
			pos: {x: -30, y:2.5, z:.5},
			size: {x:.6, y: .6, z:1}, 
			type: "sphere",
		},
		{
			description: J,
			pos: {x: -30, y:.8, z:-1.5},
			size: {x:.6, y: .6, z:1}, 
			type: "sphere",
		},
		
		{
			description: K,
			pos: {x: -30, y:-7.5, z:-8.7},
			size: {x:.6, y: .6, z:1}, 
			type: "sphere",
		},
		{
			description: K,
			pos: {x: -30, y:-7.6, z:8.6},
			size: {x:.6, y: .6, z:1}, 
			type: "sphere",
		},
		
		{
			description: L,
			pos: {x: -30, y:5.5, z:-8},
			size: {x: 1, y:1, z:1}, 
			type: "sphere",
		
		},
		
		{
			description: M,
			pos: {x: -30, y:6.5, z:7},
			size: {x: 1, y:1, z:1}, 
			type: "sphere",
		
		},
		
		{
			description: N,
			pos: {x: -30, y:1, z:-10.5},
			size: {x: 1, y:1, z:1}, 
			type: "sphere",
		
		},
		{
			description: N,
			pos: {x: -30, y:-3, z:-13},
			size: {x: .6, y:.6, z:1}, 
			type: "sphere",
		
		},
		
		// STATION 5 AND 6
		{
			description:  A1,
			pos: {x: 3.8, y:3.5, z:-30},
			size: {x: 1, y:1, z:1}, 
			type: "sphere",
			vid: "ultrasonic"
		},
		{
			description:  A1,
			pos: {x: -20.5, y:3.5, z:-30},
			size: {x: 1, y:1, z:1}, 
			type: "sphere",
			vid: "ultrasonic"
		},
		{
			description:  A2,
			pos: {x: 1, y:4.7, z:-30},
			size: {x: 1, y:1, z:1}, 
			type: "sphere",
			vid: "ultrasonic"
		},
		
		{
			description: B,
			pos: {x: 7.3, y:-2.3, z:-30},
			size: {x: 1, y:1, z:1}, 
			type: "sphere",
			vid: "dpflow",
		},
		
		{
			description: C,
			pos: {x: -28, y:-4.5, z:-30},
			size: {x: .8, y:1, z:1}, 
			type: "sphere",
			vid: "coriolis"
		},
		
		{
			description: C,
			pos: {x: 9.3, y:-3.6, z:-30},
			size: {x: .8, y:1, z:1}, 
			type: "sphere",
			vid: "coriolis"
		},
		
		{
			description: D,
			pos: {x: -26.5, y:-5.7, z:-30},
			size: {x: .7, y:1, z:1}, 
			type: "sphere",
			vid: "dpflow"
		},
		{
			description: D,
			pos: {x: -6.2, y:-7.5, z:-30},
			size: {x: .7, y:1, z:1}, 
			type: "sphere",
			vid: "dpflow"
		},
		
		{
			description: E,
			pos: {x: 9.8, y:-2.1, z:-30},
			size: {x: .7, y:1, z:1}, 
			type: "sphere",
			vid: "vortex"
		},
		{
			description: E,
			pos: {x: -27.5, y:-2.7, z:-30},
			size: {x: .8, y:1, z:1}, 
			type: "sphere",
			vid: "vortex"
		},
		
		{
			description: F,
			pos: {x: -16.3, y:5.5, z:-30},
			size: {x: .7, y:.7, z:1}, 
			type: "sphere",
			
		},
		
		{
	
			description: G,
			pos: {x: -.8, y:6.7, z:-30},
			size: {x: .7, y:.7, z:1}, 
			type: "sphere",
			
		},
		
		{
			
			description: H,
			pos: {x: -18, y:-2.1, z:-30},
			size: {x: 1, y:1, z:1}, 
			type: "sphere",
			vid: "magflow"
		},
		{
			
			description: H,
			pos: {x: -10, y:-2.8, z:-30},
			size: {x: 1, y:1, z:1}, 
			type: "sphere",
			vid: "magflow"
		},
		{
			
			description: H,
			pos: {x: -6, y:-2.8, z:-30},
			size: {x: 1, y:1, z:1}, 
			type: "sphere",
			vid: "magflow"
		},
		
		{
			description: J,
			pos: {x: -9, y:2.6, z:-30},
			size: {x: .6, y:.6, z:1}, 
			type: "sphere",
		},
		{
			description: J,
			pos: {x: -7, y:.8, z:-30},
			size: {x: .6, y:.6, z:1}, 
			type: "sphere",
		},
		
		{
			description: K,
			pos: {x: -0.1, y:-7.3, z:-30},
			size: {x: .6, y:.6, z:1}, 
			type: "sphere",
			
		},
		{
			description: K,
			pos: {x: -11, y:-7.5, z:-30},
			size: {x: .6, y:.6, z:1}, 
			type: "sphere",
		},
		
		{
			description: N,
			pos: {x: -22, y:-3.5, z:-30},
			size: {x: .8, y:.6, z:1}, 
			type: "sphere",
		},
		{
			description: N,
			pos: {x: -18.7, y:.8, z:-30},
			size: {x: 1, y:1, z:1}, 
			type: "sphere",
		}
			
	];
	
	init('images/SOE_endress.jpg', {w: 800, h: 450}, false);
	
	$.each(clickobjs, function(i, ob){
		clickObj(clickobjs[i]);
	});
	
	function init( s_material, obj_pSize, bool_sphere ) {
		$("#video").on("mousedown, mousemove", function(event){
			isUserInteracting = false;
		});
		
		$info_window = $( "#info_window" );
		$info_window.hide();
		$info_window.on("click", function() {isUserInteracting = false;});
		$info_window.draggable({
			handle: ".handle",
			drag: function(){
				$(this).css("height", "auto");
			}
		});
		
		var $container;
		
		mat = (s_material)? s_material : "images/SOE_endress.jpg";
		panoSize = (obj_pSize)? obj_pSize : {w: 900, h: 450};
		
		ratio_wh = panoSize.w / panoSize.h;
		$container = $( "#container" );
		
		panoSize.w = $container.width();
						
		CAMERA = new THREE.PerspectiveCamera( fov, ratio_wh, 1, 1000 );
		CAMERA.target = new THREE.Vector3( 0, 0, 0 );
	
		SCENE = new THREE.Scene();
			
		// light
		SCENE.add( new THREE.AmbientLight( 0x222222 ) );
		           
		// light
		var light = new THREE.PointLight( 0xaaaaaa );
		light.position = CAMERA.position;
		SCENE.add( light );		
		
		// background pano -- spherical pano img
		if (bool_sphere){
			var mesh = new THREE.Mesh( new THREE.SphereGeometry( 100, 50, 50 ), new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( mat ) } ) );
		}else{
			var mesh = new THREE.Mesh( new THREE.CylinderGeometry( 400, 400, 500, 50, 1, true ), new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( mat ) } ) );
		}
		
		mesh.scale.z = -1;
		SCENE.add( mesh );
		
		PROJECTOR = new THREE.Projector();	
		
		RENDERER = new THREE.WebGLRenderer();
		RENDERER.setSize( panoSize.w, panoSize.h );
	
		$container.append( RENDERER.domElement );
		
		// events
		$container.on("mousedown", onDocumentMouseDown);
		$container.on("mousemove", onDocumentMouseMove);
		$container.on("mouseup", onDocumentMouseUp);
		$container.on("mousewheel", onDocumentMouseWheel);
		
		document.addEventListener( 'DOMMouseScroll', onDocumentMouseWheel, false);
		window.addEventListener( 'resize', onWindowResize, false );
	
		animate();
		onWindowResize();
	}
	
	/* EVENT HANDLERS */
	function onWindowResize() {
		panoSize.w =  $( '#container' ).width();
		ratio_wh = panoSize.w/panoSize.h;
		CAMERA.aspect =  ratio_wh;
		CAMERA.updateProjectionMatrix();
		
		RENDERER.setSize( panoSize.w, panoSize.h );
	
	}
	
	function onDocumentMouseDown( event ) {
	
		event.preventDefault();
		var ar_objects = [],
	    	intersects;
	    	       
		var vector = hitVector(event);
	    PROJECTOR.unprojectVector( vector, CAMERA );
	    
	    var ray = new THREE.Raycaster( CAMERA.position, vector.sub( CAMERA.position ).normalize());
			
		intersects = ray.intersectObjects(OBJECTS); 
		
		if ( intersects.length > 0 ) {
			Reset();
	    	SELECTED = intersects[0].object;
	    	SELECTED.material.color.setHex(0xff0000);
	    		
	    	container.style.cursor = 'help';
	    	isUserInteracting = false;
	    	
	    	var pos = { x: event.clientX, y: event.clientY };
	    	
	    	$info_window.fadeIn();
	    	$("#info").html(SELECTED.description);
	    	
	    	var $vid =$("#video"); 
	    	$vid[0].pause(); 
	    	if(SELECTED.vid) {
	    		$vid.show();
		    	
		    	$("video > source").attr("src", "vids/" + SELECTED.vid + ".mp4");
		    	$vid.load();
	    	}else{
	    		$vid.hide();
	    	}
	    	
	    	    	 	
	 	} else {  // pano bg drag
	 		container.style.cursor = 'col-resize';
		   	isUserInteracting = true;
			onPointerDownPointerX = event.clientX;
			onPointerDownPointerY = event.clientY;
			onPointerDownLon = lon;
			onPointerDownLat = lat;
	   }
	
	}
	
	function onDocumentMouseMove( event ) {
		event.preventDefault();
	 	
		// pano drag
		if ( isUserInteracting ) {
			Reset();
			lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
			lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;
			
			$info_window.fadeOut();
			var vid = document.getElementById("video"); 
			if (vid)
	    		vid.pause(); 
		} 
		
		var ar_objects = [],
	    	intersects;
	    	       
		var vector = hitVector(event);
	    PROJECTOR.unprojectVector( vector, CAMERA );
	    
	    var ray = new THREE.Raycaster( CAMERA.position, vector.sub( CAMERA.position ).normalize());
			
		intersects = ray.intersectObjects(OBJECTS); 
		
		if ( intersects.length > 0 ) {
			container.style.cursor = 'help';
		} else {
			container.style.cursor = 'default';
			
		}
	}
	
	function onDocumentMouseUp( event ) {
		event.preventDefault();
		isUserInteracting = false;
		container.style.cursor = 'auto';
	}
	
	function onDocumentMouseWheel( event ) {
		var boundsMin = 20, boundsMax = 60;
		// WebKit
	
		if ( event.wheelDeltaY ) {
	
			fov -= event.wheelDeltaY * 0.05;
	
		// Opera / Explorer 9
	
		} else if ( event.wheelDelta ) {
	
			fov -= event.wheelDelta * 0.05;
	
		// Firefox
	
		} else if ( event.detail ) {
	
			fov += event.detail * 1.0;
	
		}
	
		fov = (fov < boundsMin)? boundsMin : fov;
		fov = (fov > boundsMax)? boundsMax : fov;
		CAMERA.projectionMatrix.makePerspective( fov,  ratio_wh, 1, 1100 );
		render();
	
	}
	
	/* HELPERS */
	function hitVector(event) {
		var elem = RENDERER.domElement, 
		    boundingRect = elem.getBoundingClientRect(),
		    x = (event.clientX - boundingRect.left) * (elem.width / boundingRect.width),
		    y = (event.clientY - boundingRect.top) * (elem.height / boundingRect.height);
		
		var vector = new THREE.Vector3( 
		    ( x / panoSize.w ) * 2 - 1, 
		    - ( y / panoSize.h ) * 2 + 1, 
		    0.5 
		);
		return vector;
	}
	
	function animate() {
	
		requestAnimationFrame( animate );
		render();
	
	}
	
	function render() {
	
		lat = Math.max( - 85, Math.min( 85, lat ) );
		phi = THREE.Math.degToRad( 90 - lat );
		theta = THREE.Math.degToRad( lon );
	
		CAMERA.target.x = 500 * Math.sin( phi ) * Math.cos( theta );
		CAMERA.target.y = 500 * Math.cos( phi );
		CAMERA.target.z = 500 * Math.sin( phi ) * Math.sin( theta );
	
		CAMERA.lookAt( CAMERA.target );
	
		/*
		// distortion
		CAMERA.position.x = - CAMERA.target.x;
		CAMERA.position.y = - CAMERA.target.y;
		CAMERA.position.z = - CAMERA.target.z;
		*/
	
		RENDERER.render( SCENE, CAMERA );
		
	}
	
	// Interaction methods
	function Move(axis, amt){
		var newPos = SELECTED.position,
			incr = 0.5;
		switch (axis) {
			case "x":
				newPos.x += amt*incr;
				break;
			case "y":
				newPos.y += amt*incr;
				break;
			case "z":
				newPos.z += amt*incr;
				break;
			default:
				break;
			
		}
		console.log("new pos: " + newPos.x + ", " + newPos.y + ", " + newPos.z );
		SELECTED.position.set(newPos.x, newPos.y, newPos.z);
		SELECTED.lookAt(new THREE.Vector3( 0, newPos.y, 0 ));	
		SELECTED.material.materials[4].opacity = 1;	
	}
	
	function Reset(){
		$.each(OBJECTS, function(i, obj){
			obj.material.color.setHex(0xdeedf4);
		});
		
	}
	
	function MoveTo(x,y,z, theta) {
		SELECTED.position.set(x,y,z);
		SELECTED.lookAt(new THREE.Vector3( 0, y, 0 ));
		SELECTED.material.materials[4].opacity = 1;
		// update camera
		lon=theta;
		
	}
	
	function Opacity(val) {
		SELECTED.material.materials[4].opacity = val;
	}
	
	/* HOTSPOT - click objects*/
	function clickObj(p) {
		
		var geometry = new THREE.CubeGeometry(p.size.x, p.size.y, p.size.z),
			
			material = new THREE.MeshBasicMaterial(); // default material
			
			
		switch (p.type) {
			case "texture":
				var materialClass = THREE.MeshLambertMaterial,
				side1 = new THREE.MeshBasicMaterial({color: 0xffffff, opacity: 0.1, transparent: true, wireframe: true}),
				front = new THREE.MeshLambertMaterial( {color: 0xffffff, map: THREE.ImageUtils.loadTexture( p.url ), transparent: true} ),
				materials = [side1, side1, side1, side1, front,  side1];
				material = new THREE.MeshFaceMaterial(materials),
				geometry = new THREE.CubeGeometry( 1.5, 5, 1, 4, 4, 1 );
				break;
			case "sphere":
				material = new THREE.MeshBasicMaterial( { color: 0xdeedf4, ambient: 0xffffff, overdraw: false, transparent: true, opacity: 0.4} );
				geometry = new THREE.SphereGeometry(p.size.x, 20, 20);
				
				break;
				
			case "circle":
				material = new THREE.MeshBasicMaterial( { color: 0x990000, ambient: 0xffffff, overdraw: true, transparent: true, opacity: .9} );
				geometry = new THREE.RingGeometry(p.size.x, p.size.x+0.1, 20, 1, 0);
				break;
			default:
				break;
		};
		
		// mesh
		var obj = new THREE.Mesh( geometry, material );
		obj.overdraw = true;
		obj.position.set(p.pos.x, p.pos.y, p.pos.z);
		obj.id = p.id;
		obj.name = p.name;
		obj.description = p.description;
		obj.vid = p.vid;
		obj.reset = { pos: {x:p.pos.x, y: p.pos.y, z: p.pos.z}, rot: {x:obj.rotation.x, y:obj.rotation.y, z:obj.rotation.z }};
		obj.lookAt(new THREE.Vector3( 0, 0, 0 ));								
		obj.callback = function() { 
			isUserInteracting = false;
		};
		
		OBJECTS.push(obj);
	
		SCENE.add( obj );
	};

});

