define(['require', 'leap', 'detectors'], function(require, Leap, detectors){

	"use strict";

	return function(scope, el) {

		define('scope/tracks', scope);

		require(['data/tracks'], loadTracks);

		scope.startBoth = function() {
			scope.startReceiving();
			scope.startSending();
		};

		scope.startReceiving = function() {
			scope.selectedTrack = scope.tracks[0];
			scope.startSending();
			scope.mode = 'receiving';
		};

		scope.startSending = function() {
			Leap.loop({ enableGestures: true, background: true }, detectMotions);
			el.addClass('started')
			scope.mode = 'sending';
		};

		scope.$watch('room', function(a, b){
			if (a !== b) el.addClass('has-room');
		});

		function detectMotions(frame) {
			detectors.space(frame, publishMotionEvent);
			detectors.pinch(frame, publishMotionEvent);
		}

		function publishMotionEvent(event) {
			if (!event) return;
			if (scope.onGestureEvent)
				scope.onGestureEvent(event);
			require(['pubsub'], function(pubsub){
				pubsub.publish(event);
			});
		}

		function renderTracks(tracks) {
			scope.tracks = tracks;
			scope.$apply();
		}

		function loadTracks(loader) {
			//TODO: connect this with the scope controller for the app, so that we can show errors
			loader.done(renderTracks);
		}

	}

});