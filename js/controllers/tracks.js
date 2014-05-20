define(['require', 'leap', 'detectors', 'pubsub'], function(require, Leap, detectors, pubsub){

	"use strict";

	return function(scope) {

		require(['data/tracks'], loadTracks);

		scope.startBoth = function() {
			scope.startReceiving();
			scope.startSending();
		};

		scope.startReceiving = function() {
			scope.startSending();
			scope.mode = 'receiving';
		};

		scope.startSending = function() {
			pubsub.startSession(scope.room);
			Leap.loop({ enableGestures: true, background: true }, detectMotions);
			scope.started = true;
			scope.mode = 'sending';
		};

		function detectMotions(frame) {
			detectors.space(frame, publishMotionEvent);
			detectors.pinch(frame, publishMotionEvent);
		}

		function publishMotionEvent(event) {
			if (!event) return;
			pubsub.publish(event);
		}

		function selectTrack(tracks) {
			scope.$apply(function(){
				var index = parseInt(window.location.hash || '0', 10);
				scope.tracks = tracks;
				scope.selectedTrack = scope.tracks[scope.tracks.length > index ? index : 0];
			});
		}

		function loadTracks(loader) {
			//TODO: connect this with the scope controller for the app, so that we can show errors
			loader.done(selectTrack);
		}

	}

});