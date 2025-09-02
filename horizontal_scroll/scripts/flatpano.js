/**
 * @author Vienna Ly
 * COURSE: LTC
 * Date: Apr 24, 2015
 * Description: loads an image (stitched perspective panorama) and allows user to pan image
 *
 * require javascript:
 * 	scripts jquery, jquery ui, jquery-touch-punch, imagesloaded.pkgd.min.js (added in ready script)
 *  images: photomerged perspective-stitched image, (optional) sliced images -- height - 500px (or change frame height in css)
 *  html: img
 *
 */

// options - looping:bool = if image wraps around ("360 view"), default false; image must be cropped so seams match
// options - parent:string = selector id to add this to, default body
function FlatPano(options) {
	this.parent = options.parent;
	this.looping = (options.looping)? options.looping : false;
	this.container =  $('<div id="flatpano_' + this.parent + '" class="pano-sphere frame" data-loop=' + this.looping + '></div>'	);
	
	$parent = (options.parent)? $("#" + this.parent) : $("#body");
	$parent.append(this.container);
	$parent.find("img").appendTo(this.container);
	
	this.container.imagesLoaded().always(function(instance) {
		var $panoContainer = $(instance.elements[0] );
		
		var length = $panoContainer.find("img").length;
		var $bounds = $("<div />");
		var w = 0;

		$imgHolder = $("<div />").addClass("img-holder");
		$bounds.addClass("bounds").append($imgHolder);
		$panoContainer.append($bounds);

		$panoContainer.find("img").each(function() {
			var _w = $(this).width();
			var _h = $(this).height();

			w += _w;
			$imgHolder.append(this);
			$imgHolder.height(_h);
			$imgHolder.width(w);

			var bounds_h = 2 * $imgHolder.height() - $panoContainer.height();
			var bounds_w = 2 * $imgHolder.width() - $panoContainer.width();

			$bounds = $panoContainer.find(".bounds");
			$bounds.width(bounds_w);
			$bounds.height(bounds_h);
			$bounds.css({
				top : -1 * ($imgHolder.height() - $panoContainer.height() ),
				left : -1 * ($imgHolder.width() - $panoContainer.width() )
			});
			 
			if ( $panoContainer.data('loop') && !--length) {
				// create clone of imgHolder for looping
				$imgHolder.clone().appendTo($bounds).attr("id", "clone");
				$imgHolder.css("left", 0);
				$bounds.width($panoContainer.width());
				$bounds.css({
					left : 0,
					top : 0
				});
				$("#clone").css({
					left : $imgHolder.position().left + _w
				});
				
			}

		});

		$(".img-holder").draggable();

		if (! $panoContainer.data('loop')) {
			$panoContainer.find(".img-holder").draggable("option", "containment", "parent");
		} else {
			$panoContainer.find(".img-holder").draggable("option", "axis", "x");
			$panoContainer.find(".img-holder").on("dragstart dragstop", function(event, ui) {
				start = ui.position.left;

				if ($(this).index() == 0) {
					$alt = $(this).next();
					alt_p = $alt.position();

				} else {
					$alt = $(this).prev();
					alt_p = $alt.position();
				}
			});

			$panoContainer.find(".img-holder").on("drag", function(event, ui) {
								
					var delta = ui.position.left - start;
					if ( $(this).position().left >= -5  &&  ui.position.left < alt_p.left )  { 
						$alt.css("left", ui.position.left - $(this).width() );
					}else if( $(this).position().left < -5 &&  ui.position.left > alt_p.left ){
						$alt.css("left", ui.position.left + $(this).width() );
					}else{
						$alt.css("left", delta + alt_p.left );
					}
				
			});
		}
	});
}
