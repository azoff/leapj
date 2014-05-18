define([], function(){

	"use strict";

	return function(scope) {

		require(['scope/tracks'], function(tracks){
			tracks.$watch('mode', toggleEnabled);
			tracks.onGestureEvent = setGestureEvent;
		});

		function toggleEnabled(mode) {
			scope.enabled = mode === 'sending';
		}

		var debounce;
		function setGestureEvent(event) {
			if (debounce) clearTimeout(debounce);
			debounce = setTimeout(function(){
				scope.$apply(function(){
					scope.gestureEvent = event;
				});
			}, 10);
		}

		define('scope/message', scope);

	}

});
