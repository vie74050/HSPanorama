/* SET HOTSPOTS */
	var A1 = "Ultrasonic Flow Transmitter  - A1";
	var A2 = "Ultrasonic Flow Sensor - A2";
	var B = "Orifice Plate Flow Sensor - B";
	var C = "Coriolis Flowmeter - C";
	var D = "D/P Transmitter for Orifice Plate Flow Sensor - D";
	var E = "Vortex Shedding Flowmeter - E";
	var F = "Unguided Radar Level Transmitter - F";
	var G = "Capacitance Level Transmitter - G";
	var H = "Mag Flow Transmitter - H";
	var J = "Temperature Transmitter - J";
	var K = "D/P Level Transmitter - K";
	var L = "Ultrasonic Level Transmitter - L";
	var M = "Guided Radar Level Transmitter - M";
	var N = "Control Valves - N";
	
	// click objects - e.g define params	
	var clickobjs = [
		// STATION 1 AND 2
		{
			description:  A1,
			pos: {x: -16.5, y:4, z:30},
			size: {x: 1, y:1, z:1}, 
			borderWidth: 0.1,
			type: "circle",
			vid: "ultrasonic"
		},
		{
			description:  A1,
			pos: {x: 10.5, y:4.5, z:30},
			size: {x: 1, y:1, z:1}, 
			borderWidth: 0.1,
			type: "circle",
			vid: "ultrasonic"
		},
		
		{
			description:  A2,
			pos: {x: -12.5, y:5, z:30},
			size: {x: .8, y:.6, z:1}, 
			borderWidth: 0.1,
			type: "circle",
			vid: "ultrasonic"
		},
		
		{
			description:C,
			pos: {x: -24, y:-4.5, z:30},
			size: {x: 0.7, y:0.3, z:1}, 
			borderWidth: 0.1,
			type: "circle",
			vid: "coriolis"
		
		},
		{
			description:C,
			pos: {x: 17.6, y:-4, z:30},
			size: {x: 0.7, y:0.3, z:1}, 
			borderWidth: 0.1,
			type: "circle",
			vid: "coriolis"
		
		},
		
		{
			description:D,
			pos: {x: -22, y:-5.5, z:30},
			size: {x: 0.6, y:0.3, z:1}, 
			borderWidth: 0.1,
			type: "circle",
			vid: "dpflow"
		
		},
		{
			description:D,
			pos: {x: 18.7, y:-5.3, z:30},
			size: {x: 0.6, y:0.3, z:1}, 
			borderWidth: 0.1,
			type: "circle",
			vid: "dpflow"
		
		},
		
		{
			description: E,
			pos: {x: -23.7, y:-2.7, z:30},
			size: {x: 0.6, y:0.6, z:1}, 
			borderWidth: 0.1,
			type: "circle",
			vid: "vortex"
		
		},
		{
			description: E,
			pos: {x: 18.7, y:-2.3, z:30},
			size: {x: 0.6, y:0.6, z:1}, 
			borderWidth: 0.1,
			type: "circle",
			vid: "vortex"	
		},
		
		{
			description:  G,
			pos: {x: -11.5, y:7.5, z:30},
			size: {x: 1, y:1, z:1}, 
			borderWidth: 0.1,
			type: "circle"
		},
		
		{
			description: H,
			pos: {x: 7.5, y:-1, z:30},
			size: {x: 1, y: 1, z:1}, 
			borderWidth: 0.1,
			type: "circle",
			vid: "magflow"	
		},
		{
			description: H,
			pos: {x: -.9, y:-2.5, z:30},
			size: {x: 1.1, y: 1.1, z:1}, 
			borderWidth: 0.1,
			type: "circle",
			vid: "magflow"
		},
		{
			description: H,
			pos: {x: -5.3, y:-2.8, z:30},
			size: {x: 1.1, y: 1.1, z:1}, 
			borderWidth: 0.1,
			type: "circle",
			vid: "magflow"
		},
		{
			description: H,
			pos: {x: -13.8, y:-1.7, z:30},
			size: {x: 1, y: 1, z:1}, 
			borderWidth: 0.1,
			type: "circle",
			vid: "magflow"
		},
	
		
		{
			description: J,
			pos: {x: -2.2, y:3.3, z:30},
			size: {x: .7, y: .7, z:1}, 
			borderWidth: 0.1,
			type: "circle",
		},
		{
			description: J,
			pos: {x: -4.2, y:1.4, z:30},
			size: {x: .7, y: .7, z:1}, 
			borderWidth: 0.1,
			type: "circle",
		},
		
		{
			description: K,
			pos: {x: -.5, y:-7.6, z:30},
			size: {x: .7, y: .7, z:1}, 
			borderWidth: 0.1,
			type: "circle",
		},
		{
			description: K,
			pos: {x: -13.1, y:-8, z:30},
			size: {x: .7, y: .7, z:1}, 
			borderWidth: 0.1,
			type: "circle",
		},
		
		{
			description:  L,
			pos: {x: 5.3, y:7, z:30},
			size: {x: 1, y:1, z:1}, 
			borderWidth: 0.1,
			type: "circle"
		},
		
		{
			description:  N,
			pos: {x: 10.9, y:-3.2, z:30},
			size: {x: 1, y:1.5, z:1}, 
			borderWidth: 0.1,
			type: "circle"
		},
		{
			description:  N,
			pos: {x: 7.9, y:1.8, z:30},
			size: {x: 1, y:1, z:1}, 
			borderWidth: 0.1,
			type: "circle"
		},
		{
			description:  N,
			pos: {x: -17.8, y:-3.5, z:30},
			size: {x: 1, y:.7, z:1}, 
			borderWidth: 0.1,
			type: "circle"
		},
		
		// STATION 3 AND 4
		{
			
			description: A1,
			pos: {x: -30, y:3.4, z:-12.5},
			size: {x: 1, y:1, z:1}, 
			borderWidth: 0.1,
			type: "circle",
			vid: "ultrasonic"
		},
		{
			
			description: A1,
			pos: {x: -30, y:3.4, z:11.8},
			size: {x: 1, y:1, z:1}, 
			borderWidth: 0.1,
			type: "circle",
			vid: "ultrasonic"
		},
		
		{
			
			description: A2,
			pos: {x: -30, y:4.3, z:-9.2},
			size: {x: 0.6, y:0.3, z:1}, 
			borderWidth: 0.1,
			type: "circle",
			vid: "ultrasonic"
		
		},
		
		{
			description:C,
			pos: {x: -30, y:-4.2, z:-19},
			size: {x: 0.6, y:0.3, z:1}, 
			borderWidth: 0.1,
			type: "circle",
			vid: "coriolis"
		
		},
		{
			description:C,
			pos: {x: -30, y:-4.2, z:18.5},
			size: {x: 0.6, y:0.3, z:1}, 
			borderWidth: 0.1,
			type: "circle",
			vid: "coriolis"
		
		},
		
		{
			description:D,
			pos: {x: -30, y:-5.2, z:-20.6},
			size: {x: 0.6, y:0.3, z:1}, 
			borderWidth: 0.1,
			type: "circle",
			vid: "dpflow"
		
		},
		{
			description:D,
			pos: {x: -30, y:-5.2, z:17.6},
			size: {x: 0.6, y:0.3, z:1}, 
			borderWidth: 0.1,
			type: "circle",
			vid: "dpflow"
		
		},
		
		{
			description: E,
			pos: {x: -30, y:-2.7, z:-19.2},
			size: {x: 0.6, y:0.3, z:1}, 
			borderWidth: 0.1,
			type: "circle",
			vid: "vortex"
		
		},
		{
			description: E,
			pos: {x: -30, y:-2.5, z:18},
			size: {x: 0.6, y:0.3, z:1}, 
			borderWidth: 0.1,
			type: "circle",
			vid: "vortex"	
		},
		
		{
			description: H,
			pos: {x: -30, y:-2.8, z:1.7},
			size: {x: 1, y: 1, z:1}, 
			borderWidth: 0.1,
			type: "circle",
			vid: "magflow"	
		},
		{
			description: H,
			pos: {x: -30, y:-2.8, z:-2.3},
			size: {x: 1, y: 1, z:1}, 
			borderWidth: 0.1,
			type: "circle",
			vid: "magflow"
		},
		{
			description: H,
			pos: {x: -30, y:-1.8, z:9},
			size: {x: 1, y: 1, z:1}, 
			borderWidth: 0.1,
			type: "circle",
			vid: "magflow"
		},
		
		{
			description: J,
			pos: {x: -30, y:2.5, z:.5},
			size: {x:.6, y: .6, z:1}, 
			borderWidth: 0.1,
			type: "circle",
		},
		{
			description: J,
			pos: {x: -30, y:.8, z:-1.5},
			size: {x:.6, y: .6, z:1}, 
			borderWidth: 0.1,
			type: "circle",
		},
		
		{
			description: K,
			pos: {x: -30, y:-7.5, z:-8.7},
			size: {x:.6, y: .6, z:1}, 
			borderWidth: 0.1,
			type: "circle",
		},
		{
			description: K,
			pos: {x: -30, y:-7.6, z:8.6},
			size: {x:.6, y: .6, z:1}, 
			borderWidth: 0.1,
			type: "circle",
		},
		
		{
			description: L,
			pos: {x: -30, y:5.5, z:-8},
			size: {x: 1, y:1, z:1}, 
			borderWidth: 0.1,
			type: "circle",
		
		},
		
		{
			description: M,
			pos: {x: -30, y:6.5, z:7},
			size: {x: 1, y:1, z:1}, 
			borderWidth: 0.1,
			type: "circle",
		
		},
		
		{
			description: N,
			pos: {x: -30, y:1, z:-10.5},
			size: {x: 1, y:1, z:1}, 
			borderWidth: 0.1,
			type: "circle",
		
		},
		{
			description: N,
			pos: {x: -30, y:-3, z:-13},
			size: {x: .6, y:.6, z:1}, 
			borderWidth: 0.1,
			type: "circle",
		
		},
		
		// STATION 5 AND 6
		{
			description:  A1,
			pos: {x: 3.8, y:3.5, z:-30},
			size: {x: 1, y:1, z:1}, 
			borderWidth: 0.1,
			type: "circle",
			vid: "ultrasonic"
		},
		{
			description:  A1,
			pos: {x: -20.5, y:3.5, z:-30},
			size: {x: 1, y:1, z:1}, 
			borderWidth: 0.1,
			type: "circle",
			vid: "ultrasonic"
		},
		{
			description:  A2,
			pos: {x: 1, y:4.7, z:-30},
			size: {x: 1, y:1, z:1}, 
			borderWidth: 0.1,
			type: "circle",
			vid: "ultrasonic"
		},
		
		{
			description: B,
			pos: {x: 7.3, y:-2.3, z:-30},
			size: {x: 1, y:1, z:1}, 
			borderWidth: 0.1,
			type: "circle",
			vid: "dpflow",
		},
		
		{
			description: C,
			pos: {x: -28, y:-4.5, z:-30},
			size: {x: .8, y:1, z:1}, 
			borderWidth: 0.1,
			type: "circle",
			vid: "coriolis"
		},
		
		{
			description: C,
			pos: {x: 9.3, y:-3.6, z:-30},
			size: {x: .8, y:1, z:1}, 
			borderWidth: 0.1,
			type: "circle",
			vid: "coriolis"
		},
		
		{
			description: D,
			pos: {x: -26.5, y:-5.7, z:-30},
			size: {x: .7, y:1, z:1}, 
			borderWidth: 0.1,
			type: "circle",
			vid: "dpflow"
		},
		{
			description: D,
			pos: {x: -6.2, y:-7.5, z:-30},
			size: {x: .7, y:1, z:1}, 
			borderWidth: 0.1,
			type: "circle",
			vid: "dpflow"
		},
		
		{
			description: E,
			pos: {x: 9.8, y:-2.1, z:-30},
			size: {x: .7, y:1, z:1}, 
			borderWidth: 0.1,
			type: "circle",
			vid: "vortex"
		},
		{
			description: E,
			pos: {x: -27.5, y:-2.7, z:-30},
			size: {x: .8, y:1, z:1}, 
			borderWidth: 0.1,
			type: "circle",
			vid: "vortex"
		},
		
		{
			description: F,
			pos: {x: -16.3, y:5.5, z:-30},
			size: {x: .7, y:.7, z:1}, 
			borderWidth: 0.1,
			type: "circle",
			
		},
		
		{
	
			description: G,
			pos: {x: -.8, y:6.7, z:-30},
			size: {x: .7, y:.7, z:1}, 
			borderWidth: 0.1,
			type: "circle",
			
		},
		
		{
			
			description: H,
			pos: {x: -18, y:-2.1, z:-30},
			size: {x: 1, y:1, z:1}, 
			borderWidth: 0.1,
			type: "circle",
			vid: "magflow"
		},
		{
			
			description: H,
			pos: {x: -10, y:-2.8, z:-30},
			size: {x: 1, y:1, z:1}, 
			borderWidth: 0.1,
			type: "circle",
			vid: "magflow"
		},
		{
			
			description: H,
			pos: {x: -6, y:-2.8, z:-30},
			size: {x: 1, y:1, z:1}, 
			borderWidth: 0.1,
			type: "circle",
			vid: "magflow"
		},
		
		{
			description: J,
			pos: {x: -9, y:2.6, z:-30},
			size: {x: .6, y:.6, z:1}, 
			borderWidth: 0.1,
			type: "circle",
		},
		{
			description: J,
			pos: {x: -7, y:.8, z:-30},
			size: {x: .6, y:.6, z:1}, 
			borderWidth: 0.1,
			type: "circle",
		},
		
		{
			description: K,
			pos: {x: -0.1, y:-7.3, z:-30},
			size: {x: .6, y:.6, z:1}, 
			borderWidth: 0.1,
			type: "circle",
			
		},
		{
			description: K,
			pos: {x: -11, y:-7.5, z:-30},
			size: {x: .6, y:.6, z:1}, 
			borderWidth: 0.1,
			type: "circle",
		},
		
		{
			description: N,
			pos: {x: -22, y:-3.5, z:-30},
			size: {x: .8, y:.6, z:1}, 
			borderWidth: 0.1,
			type: "circle",
		},
		{
			description: N,
			pos: {x: -18.7, y:.8, z:-30},
			size: {x: 1, y:1, z:1}, 
			borderWidth: 0.1,
			type: "circle",
		}
			
	];

	document.addEventListener("DOMContentLoaded", function() {
		const pano = new PanoViewer("container", "info_window", "video");
		pano.lon = 90;
		pano.Init("SOE_endress.jpg", false);

		clickobjs.forEach(function(ob) {
			pano.ClickObj(ob);
		});
	});