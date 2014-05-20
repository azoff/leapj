define(['pubsub'], function(){

	"use strict";

	return function(scope) {

		scope.$watch('mode', toggleEnabled);

		function toggleEnabled(mode) {
			scope.enabled = mode === 'sending';
			if (scope.enabled && !scope.subscription) {
				scope.subscription = pubsub.subscribe(setGestureEvent)
			} else if(scope.subscription) {
				pubsub.unsubscribe(scope.subscription)
				scope.subscription = null;
			}
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
