/*
 * Vienna Ly
 * Dec 8, 2015
 * 360 spherical panorama using jquery and three.js
 */

var mat, panoSize, ratio_wh, $info_window;

var CAMERA, SCENE, RENDERER, PROJECTOR, SELECTED;
var offset = new THREE.Vector3(),
	OBJECTS = [], PLANE, MOUSE2D;

/* SET PANO PARMETERS */			
var fov = 60, fov_max = 120, fov_init=60,
	isUserInteracting = false,
	lon = 0, lat = 0, 
	phi = 0, theta = 0;

/**
 * 
 * @param {*} s_material url to the panorama image to use
 * @param {*} bool_sphere true uses sphere projection, false uses cylinder projection
 * @param {*} fov_init initial field of view
 */	
function init( s_material, bool_sphere = true) {
	var $container = $( "#container" );		
	$info_window = $( "#info_window" );
	$info_window.hide();
	$info_window.on("click", function() {isUserInteracting = false;});
	$info_window.draggable({
		handle: ".handle",
		drag: function(){
			$(this).css("height", "auto");
		}
	});
	
	mat = (s_material)? s_material : "demo/demo.jpg";
	panoSize = {
		w: $container.width(),
		h: $container.height()
	};
	ratio_wh = panoSize.w / panoSize.h;
	fov = (fov_init)? fov_init : fov;
	fov_max = (fov_init)? fov_init : fov_max;

	CAMERA = new THREE.PerspectiveCamera( fov, ratio_wh, 1, 1000 );
	CAMERA.target = new THREE.Vector3( 0, 0, 0 );
	CAMERA.position.set( 0, 0, 0 );
	CAMERA.lookAt( CAMERA.target );
	
	SCENE = new THREE.Scene();
		
	// lighting
	var light = new THREE.PointLight( 0xaaaaaa );
	light.position = CAMERA.position;
	SCENE.add( light );		
	SCENE.add( new THREE.AmbientLight( 0x222222 ) );
	
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
	if ($("#video").length) {
		$("#video").on("mousedown, mousemove", function(event){
			isUserInteracting = false;
		});
	}

	document.addEventListener( 'DOMMouseScroll', onDocumentMouseWheel, false);
	window.addEventListener( 'resize', onWindowResize, false );

	animate();
	onWindowResize();
	addEventListener('resize', onWindowResize);
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
	var intersects;
				
	var vector = hitVector(event);
	PROJECTOR.unprojectVector( vector, CAMERA );
	
	var ray = new THREE.Raycaster( CAMERA.position, vector.sub( CAMERA.position ).normalize());
		
	intersects = ray.intersectObjects(OBJECTS, true); // checks mesh and children mesh of groups
	
	if ( intersects.length > 0 ) {
		Reset();
		SELECTED = intersects[0].object;

		// check if is a grouped object (i.e. circle)
		const parent = SELECTED.parent;
		SELECTED = parent;
		if (parent && parent.userData.type === "circle") {
			parent.children[0].material.color.setHex(0xff0000); // Highlight first child (border)
			parent.children[0].material.opacity = 0.5; // increase opacity
		} else {
			if (SELECTED.material && SELECTED.material instanceof THREE.MeshBasicMaterial) {
				// SELECTED.material is a MeshBasicMaterial
				SELECTED.material.color.setHex(0xff0000); // SELECTED color
			}
		}
						
		container.style.cursor = 'help';
		isUserInteracting = false;
		
		var pos = { x: event.clientX, y: event.clientY }; console.log(pos, SELECTED);
		
		$info_window.fadeIn();
		$("#info").html(SELECTED.description);
		
		var $vid =$("#video"); 
		
		if ($vid.length) {
			$vid[0].pause(); 
			if (SELECTED.vid) {
				$vid.show();
				$("video > source").attr("src", SELECTED.vid + ".mp4");
				$vid[0].load();
			} else {
				$vid.hide();
			}
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
	
	var intersects;
				
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
	var boundsMin = 20, boundsMax = fov_max;
	// WebKit

	if ( event.wheelDeltaY ) {

		fov -= event.wheelDeltaY * 0.01;

	// Opera / Explorer 9

	} else if ( event.wheelDelta ) {

		fov -= event.wheelDelta * 0.01;

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

/* HOTSPOT - click objects*/
function ClickObj(p) {
	
	var geometry = new THREE.CubeGeometry(p.size.x, p.size.y, p.size.z),		
		material = new THREE.MeshBasicMaterial(); // default material

	var obj;

	switch (p.type) {
		case "texture":
			var side1 = new THREE.MeshBasicMaterial({color: 0xffffff, opacity: 0.1, transparent: true, wireframe: true}),
				front = new THREE.MeshLambertMaterial( {color: 0xffffff, map: THREE.ImageUtils.loadTexture( p.url ), transparent: true} ),
				materials = [side1, side1, side1, side1, front,  side1];
				material = new THREE.MeshFaceMaterial(materials),
				geometry = new THREE.CubeGeometry( 1.5, 5, 1, 4, 4, 1 );
				obj = new THREE.Mesh( geometry, material );
			break;
		case "sphere":
			material = new THREE.MeshBasicMaterial( { color: 0xffffff, ambient: 0xffffff, overdraw: false, transparent: true, opacity: 0.4} );
			geometry = new THREE.SphereGeometry(p.size.x, 20, 20);
			obj = new THREE.Mesh( geometry, material );
			break;
			
		case "circle":
			const radius = p.size.x;
			const borderWidth = p.borderWidth || 0.5;

			// Filled circle
			const fillGeometry = new THREE.CircleGeometry(radius, 32);
			const fillMaterial = new THREE.MeshBasicMaterial({
				color: p.fillColor || 0xffffff,
				transparent: true,
				opacity: 0.01
			});
			const fillMesh = new THREE.Mesh(fillGeometry, fillMaterial);

			// Border ring
			const borderGeometry = new THREE.RingGeometry(radius - borderWidth, radius, 32);
			const borderMaterial = new THREE.MeshBasicMaterial({
				color: p.borderColor || 0xffffff,
				side: THREE.DoubleSide,
				transparent: true,
				opacity: 0.2
			});
			const borderMesh = new THREE.Mesh(borderGeometry, borderMaterial);
			borderMesh.position.z += 0.01; // Prevent z-fighting

			obj = new THREE.Group();
			obj.add(borderMesh);
			obj.add(fillMesh);
			

			break;
		default:
			break;
	};
		
	obj.userData.type = p.type;
	obj.userData.selectable = true;
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

// Interaction methods

// Move the selected object along a specified axis
function Move(axis, amt){
	const parent = SELECTED.parent;
	if (parent && parent.userData.type === "circle") {
		SELECTED = parent; // if grouped object, move the parent
	}

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

	if (SELECTED.type === "texture") {
			
		SELECTED.material.materials[4].opacity = 1;	
	}
	
}

function MoveTo(x,y,z, theta) {
	SELECTED.position.set(x,y,z);
	SELECTED.lookAt(new THREE.Vector3( 0, y, 0 ));
	SELECTED.material.materials[4].opacity = 1;
	// update camera
	lon=theta;
	
}

function Opacity(val) {

	if (SELECTED.type === "texture") {
		SELECTED.material.materials[4].opacity = val;
	}
}

function Reset(){
	$.each(OBJECTS, function(i, obj){
		if (obj.userData.type === "circle") {
			// Reset the border color of the first child
			obj.children[0].material.color.setHex(0xffffff);
			obj.children[0].material.opacity = 0.2; // reset opacity
		}
		if (obj.material && obj.material instanceof THREE.MeshBasicMaterial) {
			// obj.material is a MeshBasicMaterial
			obj.material.color.setHex(0xffffff); // reset to default color
		}
	});	
}
