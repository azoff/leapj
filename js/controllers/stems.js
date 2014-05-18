define(['jquery'], function($){

	"use strict";

	return function(scope, el) {

		var x = { center: 50, max: 70, min: 30 };
		var y = { center: 15, max: 50, min: -25 };

		var win = $(window);
		win.mouseout(resetPerspective);
		win.mouseover(trackPerspective);

		function setPerspective(x, y) {
			el.css({ perspectiveOrigin: x+'% '+y+'%' });
		}

		function resetPerspective() {
			setPerspective(x.center, y.center);
		}

		function trackPerspective(event) {
			var pctX = event.pageX / win.width();
			var pctY = event.pageY / win.height();
			var delX = x.max - pctX * (x.max - x.min);
			var delY = y.max - pctY * (y.max - y.min);
			setPerspective(delX, delY);
		}

	}

});
