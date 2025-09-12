/*
 * Vienna Ly
 * Update Sep 3 2025
 * 360 panorama using three.js (no jQuery)
 */

/**
 * PanoViewer is a 3D panorama viewer using THREE.js, supporting interactive Hotspots (ClickObj) that display content in info window.
 *
 * @class
 * @param {string} containerId - The DOM element ID for the panorama container.
 * @param {string} infoWindowId - The DOM element ID for the info window.
 * @param {string} videoId - Optional - The DOM element ID for the video element.
 *
 * @typedef {Object} ClickObjParams
 * @property {string} type - The type of object ("texture", "sphere", "circle").
 * @property {string} [id] - Unique identifier for the object.
 * @property {string} [name] - Name of the object.
 * @property {string} [description] - Description to show in the info window (string, html)
 * @property {string} [vid] - Video URL of mp4 to play when selected. 
 * @property {string} [url] - Texture image URL (for type "texture").
 * @property {Object} pos - Position of the object in 3D space.
 * @property {number} pos.x - X coordinate.
 * @property {number} pos.y - Y coordinate.
 * @property {number} pos.z - Z coordinate.
 * @property {Object} [size] - Size of the object (for "sphere" and "circle").
 * @property {number} [size.x] - Radius or width.
 * @property {number} [size.y] - Height 
 * @property {number} [size.z] - Depth 
 * @property {number} [borderWidth] - Border width (for "circle").
 * @property {number} [fillColor] - Fill color (hex, for "sphere" and "circle").
 * @property {number} [borderColor] - Border color (hex, for "circle").
 *
 * @method Init Initializes the panorama viewer.
 * @method ClickObj Adds an interactive object to the panorama.
 * @method Move Moves the selected object along an axis.
 * @method MoveTo Moves the selected object to a specific position.
 * @method MoveAroundY Rotates the selected object around the Y axis.
 * @method MoveCloser Moves the selected object closer or farther.
 * @method Opacity Sets the opacity of the selected texture object.
 * @method Reset Resets object selection and appearance.
 */
class PanoViewer {
	constructor(containerId, infoWindowId, videoId) {
		this.container = document.getElementById(containerId);
		this.infoWindow = document.getElementById(infoWindowId);
		this.video = document.getElementById(videoId);
		this.panomesh = null;
		this.panoSize = { w: 0, h: 0 };
		this.ratio_wh = 1;
		this.fov = 60;		// the current field of view
		this.fov_max = 120;
		this.fov_init = 60;	// to set initial field of view
		this.isUserInteracting = false;
		this.lon = 0;  		// longitude for camera angle
		this.lat = 0;  		// latitude for camera angle
		this.phi = 0;	 	// vertical angle calc from lat
		this.theta = 0;  	// horizontal angle calc from lon
		this.CAMERA = null;
		this.SCENE = null;
		this.RENDERER = null;
		this.PROJECTOR = null;
		this.SELECTED = null;
		this.OBJECTS = [];
		this.offset = new THREE.Vector3();
		this.PLANE = null;
		this.MOUSE2D = null;
		this.onPointerDownPointerX = 0;
		this.onPointerDownPointerY = 0;
		this.onPointerDownLon = 0;
		this.onPointerDownLat = 0;
		this._setupInfoWindowDrag();
	}

	Init(s_material, bool_sphere = true, fov_init = 60) {
		this.infoWindow.style.display = "none";
		
		this.panoSize = {
			w: this.container.offsetWidth,
			h: this.container.offsetHeight
		};
		this.ratio_wh = this.panoSize.w / this.panoSize.h;
		this.fov = fov_init || this.fov;
		this.fov_max = fov_init || this.fov_max;

		this.CAMERA = new THREE.PerspectiveCamera(this.fov, this.ratio_wh, 1, 1000);
		this.CAMERA.target = new THREE.Vector3(0, 0, 0);
		this.CAMERA.position.set(0, 0, 0);
		this.CAMERA.lookAt(this.CAMERA.target);

		this.SCENE = new THREE.Scene();

		// lighting
		const light = new THREE.PointLight(0xaaaaaa);
		light.position.copy(this.CAMERA.position);
		this.SCENE.add(light);
		this.SCENE.add(new THREE.AmbientLight(0x222222));

		// background pano
		let mat = s_material || "demo/demo.jpg";
		this.SetPanoMaterial(mat, bool_sphere);
		this.SCENE.add(this.panomesh);

		this.PROJECTOR = new THREE.Projector();

		this.RENDERER = new THREE.WebGLRenderer();
		this.RENDERER.setSize(this.panoSize.w, this.panoSize.h);

		this.container.appendChild(this.RENDERER.domElement);

		// events
		this.container.addEventListener("mousedown", this.onDocumentMouseDown.bind(this));
		this.container.addEventListener("mousemove", this.onDocumentMouseMove.bind(this));
		this.container.addEventListener("mouseup", this.onDocumentMouseUp.bind(this));
		this.container.addEventListener("wheel", this.onDocumentMouseWheel.bind(this));

		// Touch events
		this.container.addEventListener("touchstart", (e) => {
			if (e.touches.length === 1) {
				const touch = e.touches[0];
				const fakeEvent = {
					clientX: touch.clientX,
					clientY: touch.clientY,
					preventDefault: () => e.preventDefault()
				};
				this.onDocumentMouseDown(fakeEvent);
		 }
		}, { passive: false });

		this.container.addEventListener("touchmove", (e) => {
			if (e.touches.length === 1) {
				const touch = e.touches[0];
				const fakeEvent = {
					clientX: touch.clientX,
					clientY: touch.clientY,
					preventDefault: () => e.preventDefault()
				};
				this.onDocumentMouseMove(fakeEvent);
		 }
		}, { passive: false });

		this.container.addEventListener("touchend", (e) => {
			const fakeEvent = {
				preventDefault: () => e.preventDefault()
			};
			this.onDocumentMouseUp(fakeEvent);
		}, { passive: false });

		// Pinch to zoom (touch wheel)
		this.container.addEventListener("touchmove", (e) => {
			if (e.touches.length === 2) {
				e.preventDefault();
				const dx = e.touches[0].clientX - e.touches[1].clientX;
				const dy = e.touches[0].clientY - e.touches[1].clientY;
				const dist = Math.sqrt(dx * dx + dy * dy);
				if (this._lastPinchDist !== undefined) {
					const delta = dist - this._lastPinchDist;
					const fakeWheelEvent = {
						wheelDeltaY: delta,
						preventDefault: () => {}
					};
					this.onDocumentMouseWheel(fakeWheelEvent);
				}
				this._lastPinchDist = dist;
			} else {
				this._lastPinchDist = undefined;
			}
		}, { passive: false });

		if (this.video) {
			this.video.addEventListener("mousedown", () => { this.isUserInteracting = false; });
			this.video.addEventListener("mousemove", () => { this.isUserInteracting = false; });
			this.video.addEventListener("touchstart", () => { this.isUserInteracting = false; });
			this.video.addEventListener("touchmove", () => { this.isUserInteracting = false; });
		}
		
		document.addEventListener('DOMMouseScroll', this.onDocumentMouseWheel.bind(this), false);
		window.addEventListener('resize', this.onWindowResize.bind(this), false);

		this.animate();
		this.onWindowResize();
	}

	_setupInfoWindowDrag() {
		if (!this.infoWindow) return;
		this.infoWindow.addEventListener("click", () => { this.isUserInteracting = false; });
		const dragHandle = this.infoWindow.querySelector(".handle");
		let isDragging = false, dragOffset = { x: 0, y: 0 };
		if (dragHandle) {
			dragHandle.addEventListener("mousedown", (e) => {
				isDragging = true;
				dragOffset.x = e.clientX - this.infoWindow.offsetLeft;
				dragOffset.y = e.clientY - this.infoWindow.offsetTop;
				this.infoWindow.style.height = "auto";
				document.body.style.userSelect = "none";
			});
			document.addEventListener("mousemove", (e) => {
				if (isDragging) {
					this.infoWindow.style.left = (e.clientX - dragOffset.x) + "px";
					this.infoWindow.style.top = (e.clientY - dragOffset.y) + "px";
				}
			});
			document.addEventListener("mouseup", () => {
				isDragging = false;
				document.body.style.userSelect = "";
			});

			// Touch events for mobile
			dragHandle.addEventListener("touchstart", (e) => {
				if (e.touches.length === 1) {
					const touch = e.touches[0];
					isDragging = true;
					dragOffset.x = touch.clientX - this.infoWindow.offsetLeft;
					dragOffset.y = touch.clientY - this.infoWindow.offsetTop;
					this.infoWindow.style.height = "auto";
					document.body.style.userSelect = "none";
					e.preventDefault();
				}
			}, { passive: false });

			document.addEventListener("touchmove", (e) => {
				if (isDragging && e.touches.length === 1) {
					const touch = e.touches[0];
					this.infoWindow.style.left = (touch.clientX - dragOffset.x) + "px";
					this.infoWindow.style.top = (touch.clientY - dragOffset.y) + "px";
					e.preventDefault();
				}
			}, { passive: false });

			document.addEventListener("touchend", () => {
				isDragging = false;
				document.body.style.userSelect = "";
			}, { passive: false });
		}
	}

	onWindowResize() {
		this.panoSize.w = this.container.offsetWidth;
		this.panoSize.h = this.container.offsetHeight;
		this.ratio_wh = this.panoSize.w / this.panoSize.h;
		this.CAMERA.aspect = this.ratio_wh;
		this.CAMERA.updateProjectionMatrix();
		this.RENDERER.setSize(this.panoSize.w, this.panoSize.h);
	}

	onDocumentMouseDown(event) {
		event.preventDefault();
		let intersects;
		const vector = this.hitVector(event);
		this.PROJECTOR.unprojectVector(vector, this.CAMERA);

		const ray = new THREE.Raycaster(this.CAMERA.position, vector.sub(this.CAMERA.position).normalize());
		intersects = ray.intersectObjects(this.OBJECTS, true);

		if (intersects.length > 0) {
			this.Reset();
			this.SELECTED = intersects[0].object;

			const parent = this.SELECTED.parent;
			if (parent && parent.userData.type === "circle") {
				this.SELECTED = parent;
				parent.children[0].material.color.setHex(0xff0000);
				parent.children[0].material.opacity = 0.5;
			} else {
				if (this.SELECTED.material && this.SELECTED.material instanceof THREE.MeshBasicMaterial) {
					this.SELECTED.material.color.setHex(0xff0000);
				}
			}

			this.container.style.cursor = 'help';
			this.isUserInteracting = false;

			this.infoWindow.style.display = "block";
			document.getElementById("info").innerHTML = this.SELECTED.description;

			if (this.video) {
				this.video.pause();
				if (this.SELECTED.vid) {
					this.video.style.display = "block";
					const source = this.video.querySelector("source");
					source.setAttribute("src", this.SELECTED.vid );
					this.video.load();
				} else {
					this.video.style.display = "none";
				}
			}
		} else {
			this.container.style.cursor = 'col-resize';
			this.isUserInteracting = true;
			this.onPointerDownPointerX = event.clientX;
			this.onPointerDownPointerY = event.clientY;
			this.onPointerDownLon = this.lon;
			this.onPointerDownLat = this.lat;
		}
	}

	onDocumentMouseMove(event) {
		event.preventDefault();

		if (this.isUserInteracting) {
			this.Reset();
			this.lon = (this.onPointerDownPointerX - event.clientX) * 0.1 + this.onPointerDownLon;
			this.lat = (event.clientY - this.onPointerDownPointerY) * 0.1 + this.onPointerDownLat;

			this.infoWindow.style.display = "none";
			if (this.video) this.video.pause();
		}

		const vector = this.hitVector(event);
		this.PROJECTOR.unprojectVector(vector, this.CAMERA);

		const ray = new THREE.Raycaster(this.CAMERA.position, vector.sub(this.CAMERA.position).normalize());
		const intersects = ray.intersectObjects(this.OBJECTS);

		this.container.style.cursor = intersects.length > 0 ? 'help' : 'default';
	}

	onDocumentMouseUp(event) {
		event.preventDefault();
		this.isUserInteracting = false;
		this.container.style.cursor = 'auto';
	}

	onDocumentMouseWheel(event) {
		const boundsMin = 20, boundsMax = this.fov_max;
		if (event.wheelDeltaY) {
			this.fov -= event.wheelDeltaY * 0.01;
		} else if (event.wheelDelta) {
			this.fov -= event.wheelDelta * 0.01;
		} else if (event.detail) {
			this.fov += event.detail * 1.0;
		}

		this.fov = Math.max(boundsMin, Math.min(boundsMax, this.fov));
		this.CAMERA.projectionMatrix.makePerspective(this.fov, this.ratio_wh, 1, 1100);
		this.render();
	}

	hitVector(event) {
		const elem = this.RENDERER.domElement,
			boundingRect = elem.getBoundingClientRect(),
			x = (event.clientX - boundingRect.left) * (elem.width / boundingRect.width),
			y = (event.clientY - boundingRect.top) * (elem.height / boundingRect.height);

		return new THREE.Vector3(
			(x / this.panoSize.w) * 2 - 1,
			-(y / this.panoSize.h) * 2 + 1,
			0.5
		);
	}

	animate() {
		requestAnimationFrame(this.animate.bind(this));
		this.render();
	}

	render() {
		this.lat = Math.max(-85, Math.min(85, this.lat));
		this.phi = THREE.Math.degToRad(90 - this.lat);
		this.theta = THREE.Math.degToRad(this.lon);

		this.CAMERA.target.x = 500 * Math.sin(this.phi) * Math.cos(this.theta);
		this.CAMERA.target.y = 500 * Math.cos(this.phi);
		this.CAMERA.target.z = 500 * Math.sin(this.phi) * Math.sin(this.theta);

		this.CAMERA.lookAt(this.CAMERA.target);

		this.RENDERER.render(this.SCENE, this.CAMERA);
	}

	SetPanoMaterial(s_mat, bool_sphere = true) {
		
		let mesh;
		if (bool_sphere) {
			mesh = new THREE.Mesh(
				new THREE.SphereGeometry(100, 50, 50)
			);
		} else {
			mesh = new THREE.Mesh(
				new THREE.CylinderGeometry(400, 400, 500, 50, 1, true)
			);
		}
		const texloader = new THREE.TextureLoader();
		texloader.setCrossOrigin("anonymous");
		texloader.load(s_mat, (texture) => {
			mesh.material = new THREE.MeshBasicMaterial({ map: texture });
		});

		mesh.scale.z = -1;
		
		this.panomesh = mesh;
		// update scene pano mesh rendering
		if (this.SCENE) {
			const existing = this.SCENE.getObjectByName("panomesh");
			if (existing) {
				this.SCENE.remove(existing);
			}
			this.panomesh.name = "panomesh";
			this.SCENE.add(this.panomesh);
		}
		
	}

	ClickObj(p) {
		let geometry, material, obj;
		
		if (p.pos == null) {
			// if not p.pos provided, a generic position is created at a point 10 units in front of the camera
			const pos = this.CAMERA.position.clone().add(this.CAMERA.getWorldDirection(new THREE.Vector3()).multiplyScalar(10));
			p.pos = { x: pos.x, y: pos.y, z: pos.z };
		}

		if (p.size == null) {
			p.size = { x: 1, y: 1, z: 1 };
		}

		if (p.type == null) {
			p.type = "circle";
		}

		switch (p.type) {
			case "texture":
				const texloader = new THREE.TextureLoader();
				texloader.setCrossOrigin("anonymous");
				texloader.load(p.url, (texture) => {
					const side1 = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.1, transparent: true, wireframe: true }),
						front = new THREE.MeshLambertMaterial({ color: 0xffffff, map: texture, transparent: true }),
						materials = [side1, side1, side1, side1, front, side1];
					material = new THREE.MeshFaceMaterial(materials);
					geometry = new THREE.CubeGeometry(1.5, 5, 1, 4, 4, 1);
				});
				obj = new THREE.Mesh(geometry, material);
				break;
			case "sphere":
				material = new THREE.MeshBasicMaterial({
					color: p.fillColor || 0xffffff,
					ambient: 0xffffff,
					overdraw: false,
					transparent: true,
					opacity: 0.4
				});
				geometry = new THREE.SphereGeometry(p.size.x, 20, 20);
				obj = new THREE.Mesh(geometry, material);
				break;
			case "circle":
				const radius = p.size.x;
				const borderWidth = p.borderWidth || 0.1;
				const fillGeometry = new THREE.CircleGeometry(radius, 32);
				const fillMaterial = new THREE.MeshBasicMaterial({
					color: p.fillColor || 0xffffff,
					transparent: true,
					opacity: 0.01
				});
				const fillMesh = new THREE.Mesh(fillGeometry, fillMaterial);
				const borderGeometry = new THREE.RingGeometry(radius - borderWidth, radius, 32);
				const borderMaterial = new THREE.MeshBasicMaterial({
					color: p.borderColor || 0xffffff,
					side: THREE.DoubleSide,
					transparent: true,
					opacity: 0.2
				});
				const borderMesh = new THREE.Mesh(borderGeometry, borderMaterial);
				borderMesh.position.z += 0.01;
				obj = new THREE.Group();
				obj.add(borderMesh);
				obj.add(fillMesh);
				break;
			default:
				return;
		}
		
		obj.userData = p;
		obj.overdraw = true;
		obj.position.set(p.pos.x, p.pos.y, p.pos.z);
		obj.name = p.name;
		obj.description = p.description;
		obj.vid = p.vid;
		obj.reset = { pos: { x: p.pos.x, y: p.pos.y, z: p.pos.z }, rot: { x: obj.rotation.x, y: obj.rotation.y, z: obj.rotation.z } };
		obj.lookAt(new THREE.Vector3(0, 0, 0));
		obj.callback = () => { this.isUserInteracting = false; };

		this.OBJECTS.push(obj);
		this.SCENE.add(obj);
		return obj;
	}

	Move(axis, amt) {
		const parent = this.SELECTED.parent;
		if (parent && parent.userData.type === "circle") {
			this.SELECTED = parent;
		}
		const newPos = this.SELECTED.position;
		const incr = 0.5;
		switch (axis) {
			case "x": newPos.x += amt * incr; break;
			case "y": newPos.y += amt * incr; break;
			case "z": newPos.z += amt * incr; break;
			default: break;
		}
		this.SELECTED.position.set(newPos.x, newPos.y, newPos.z);
		this.SELECTED.lookAt(new THREE.Vector3(0, newPos.y, 0));
		if (this.SELECTED.userData.type === "texture") {
			this.SELECTED.material.materials[4].opacity = 1;
		}
	
		//console.log("Position:", this.SELECTED.position);
	}

	MoveTo(x, y, z, theta) {
		this.SELECTED.position.set(x, y, z);
		this.SELECTED.lookAt(new THREE.Vector3(0, y, 0));
		this.SELECTED.material.materials[4].opacity = 1;
		this.lon = theta;
	}

	MoveAroundY(theta) {
		// Moves the position of this.SELECTED by theta degrees around the Y axis (vertical axis)

		const radius = this.SELECTED.position.length();
		const phi = Math.acos(this.SELECTED.position.y / radius);
		let thetaCurrent = Math.atan2(this.SELECTED.position.z, this.SELECTED.position.x);
		thetaCurrent += THREE.Math.degToRad(theta);

		// Convert spherical coordinates to Cartesian
		const x = radius * Math.sin(phi) * Math.cos(thetaCurrent);
		const y = radius * Math.cos(phi);
		const z = radius * Math.sin(phi) * Math.sin(thetaCurrent);
		this.SELECTED.position.set(x, y, z);

		// Make the object face the center horizontally
		this.SELECTED.lookAt(new THREE.Vector3(0, this.SELECTED.position.y, 0));
		//console.log("Position:", this.SELECTED.position);
	}

	MoveCloser(amt) {
		const direction = new THREE.Vector3();
		this.SELECTED.getWorldDirection(direction);
		direction.multiplyScalar(amt);
		this.SELECTED.position.add(direction);
		//console.log("Position:", this.SELECTED.position);
	}
	
	Opacity(val) {
		if (this.SELECTED.userData.type === "texture") {
			this.SELECTED.material.materials[4].opacity = val;
		}
	}
	DeleteClickObj() {
		if (this.SELECTED) {
			this.SCENE.remove(this.SELECTED);
			this.OBJECTS = this.OBJECTS.filter(obj => obj !== this.SELECTED);
			this.SELECTED = null;
		}
		this.Reset();
		this.infoWindow.style.display = "none";
	}
	Reset() {
		this.OBJECTS.forEach(obj => {
			if (obj.userData.type === "circle") {
				obj.children[0].material.color.setHex(0xffffff);
				obj.children[0].material.opacity = 0.2;
			}
			if (obj.material && obj.material instanceof THREE.MeshBasicMaterial) {
				obj.material.color.setHex(0xffffff);
			}
		});
	}
}

// Usage example:
// const pano = new PanoViewer("container", "info_window", "video");
// pano.init("demo/demo.jpg", true, 60);
