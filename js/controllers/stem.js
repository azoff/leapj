define(['visuals', 'pubsub', 'gestures'], function(visuals, pubsub, gestures){

	"use strict";

	return function(scope, el) {

		scope.loading = true;
		scope.stem.promise.done(loaded);
		scope.$watch('playing', toggleVisuals);

		function toggleVisuals(playing) {
			if (!scope.visualizer) return;
			if (playing) scope.visualizer.start();
			else scope.visualizer.stop();
		}

		pubsub.subscribe(applyControlMessage);

		function applyControlMessage(msg) {
			gestures.processMessage(msg, scope.stem);
			scope.$apply(function(){
				scope.visualizer.setBaseColor(msg.user.color);
				scope.stem.name = msg.user.alias;
			});
		}

		function loaded() {
			var canvas = el.find('canvas');
			scope.visualizer = new visuals.Visualizer(canvas, scope.stem.player);
			scope.visualizer.start();
			scope.$apply(function(){
				scope.loading = false;
			});
		}

	}

});
