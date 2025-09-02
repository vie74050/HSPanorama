/**
 * @author Vienna Ly
 * COURSE: LTC
 * Date: Apr 16, 2015
 * Description: loads an image (spherical perspective panorama) and allows user to pan image
 *
 * require javascript:
 * 	scripts - jquery, jquery ui, jquery-touch-punch
 *  image: photomerge images in div specified by container_id
 *
 */

function Flatscroll(container_id, options) {
	var options = options || {};
	var $parent = $("#" + container_id);
	var $bounds = $("<div/>");
	var $imgHolder = $("<div/>");
	var w_ttl = 0;
	
	//set up container divs
	$parent.append($bounds);
	$bounds.addClass("_bounds").append($imgHolder);
	$imgHolder.addClass("_imgHolder");
	
	// listen for images loadwed
	$parent.imagesLoaded().always(function(instance) {
		console.log('all images loaded', instance);
		$("footer").append("<p>imagesloaded</p>");
		
		// one image -- no slicing	
		$.each( instance.images, function(i, val){
			$imgHolder.append(val.img);
			
			if(instance.images.length == 1){
				w_ttl = 2* $(instance.images[0].img).width();
			}else{
				w_ttl += $(val.img).width();
			}
			
			$imgHolder.innerWidth(w_ttl);
			$("footer").append("<p>imgholder w:" + w_ttl + "</p>");
		});
		
	}).done(function(instance) {
		//console.log('all images successfully loaded');
		
	}).fail(function() {
		//console.log('all images loaded, at least one is broken');
		$("footer").append("<p>failed to load image(s)</p>");
	}).progress(function(instance, image) {
		var result = image.isLoaded ? 'loaded' : 'broken';
		//console.log('image is ' + result + ' for ' + image.img.src);
	});
	
	
	$imgHolder.draggable({
		start: function(event, ui) {
	        start = ui.position.left;
	        $("footer").append("<p id='dragdebug'></p>");
	    },
	    drag: function(event, ui) {
	        dir = (start < ui.position.left) ? 'rigth':'left';
	       	$("#dragdebug").text(dir);
	    }
	});

}

/*
 $(document).ready(function() {
 var length = $(".img-holder img").length;
 var $bounds = $("<div/>");
 var w=0;
 var $imgHolder = $(".img-holder");

 $(".img-holder img").each(function(){
 var _w = $(this).width();
 var _h = $(this).height();

 w += _w;

 // all images loaded
 if ( $(this).index() == length-1 ) {
 $imgHolder.width(w);

 var bounds_h = 2*$imgHolder.height() - $(".frame").height();
 var bounds_w = 2*$imgHolder.width() - $(".frame").width();

 $bounds.width(bounds_w);
 $bounds.height(bounds_h);
 $bounds.css({
 top: -1 * ( $imgHolder.height() - $(".frame").height() ),
 left: -1 * ( $imgHolder.width() - $(".frame").width() )
 });

 $(".frame").append($bounds);
 $bounds.addClass("bounds").append($imgHolder);
 $("footer").append(" b: " + bounds_w + ", " + bounds_h + "--- holder: " + w + ", " + $imgHolder.height() + " ---- frame: " + $(".frame").width() + ", "+ $(".frame").height() );
 }
 });

 $imgHolder.draggable({
 containment: "parent"
 });

 });
 */