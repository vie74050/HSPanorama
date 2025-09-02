/**
 * @author Vienna Ly
 * COURSE: LTC
 * Date: Apr 16, 2015
 * Description: loads an image (spherical perspective panorama) and allows user to pan image
 *
 * require javascript:
 * 	scripts - jquery, jquery ui, jquery-touch-punch
 *  images: photomerge - spherical perspective, sliced -- height
 *
 */

$(document).ready(function() {
	var pano = new FlatPano("#pano1", true);
});

// #parent_id:string = container id
// looping:bool = should image wrap around ("360")
function FlatPano(parent_id, looping) {
	$parent = $(parent_id);

	$parent.imagesLoaded().always(function(instance) {
		var length = $parent.find("img").length;
		var $bounds = $("<div />");
		var w = 0;

		$imgHolder = $("<div />").addClass("img-holder");
		$bounds.addClass("bounds").append($imgHolder);
		$parent.append($bounds);

		$parent.find("img").each(function() {
			var _w = $(this).width();
			var _h = $(this).height();

			w += _w;
			$imgHolder.append(this);
			$imgHolder.height(_h);

			$imgHolder.width(w);

			var bounds_h = 2 * $imgHolder.height() - $parent.height();
			var bounds_w = 2 * $imgHolder.width() - $parent.width();

			$bounds.width(bounds_w);
			$bounds.height(bounds_h);
			$bounds.css({
				top : -1 * ($imgHolder.height() - $parent.height() ),
				left : -1 * ($imgHolder.width() - $parent.width() )
			});

			if (looping && !--length) {
				// create clone of imgHolder for looping
				$imgHolder.clone().appendTo($bounds).attr("id", "clone");
				$imgHolder.css("left", 0);
				$bounds.width($parent.width());
				$bounds.css({
					left : 0,
					top : 0
				});
				$("#clone").css({
					left : $imgHolder.position().left + _w
				});
				
			}

		});

		$(".img-holder").draggable({
			axis : "x"
		});

		if (!looping) {
			$(".img-holder").draggable("option", "containment", "parent");
		} else {
			$(".img-holder").on("dragstart dragstop", function(event, ui) {
				start = ui.position.left;

				if ($(this).index() == 0) {
					$alt = $(this).next();
					alt_p = $alt.position();

				} else {
					$alt = $(this).prev();
					alt_p = $alt.position();
				}
			});

			$(".img-holder").on("drag", function(event, ui) {
				//console.log($alt);
				dir = (start < ui.position.left) ? 'right' : 'left';
				
				
					var delta = ui.position.left - start;
					if ( $(this).position().left >= -5  &&  ui.position.left < alt_p.left )  { 
						$alt.css("left", ui.position.left - $(this).width() );
						console.log("on left", ui.position.left , $(this).position().left);
					}else if( $(this).position().left < -5 &&  ui.position.left > alt_p.left ){
						$alt.css("left", ui.position.left + $(this).width() );
						console.log("on right");
					}else{
						$alt.css("left", delta + alt_p.left );
						console.log("just following");
					}
				

			});
		}
	});
}
