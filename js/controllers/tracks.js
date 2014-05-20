define(['require', 'leap', 'detectors', 'pubsub', 'user'], function(require, Leap, detectors, pubsub, users){

	"use strict";

	return function(scope) {

		require(['data/tracks'], loadTracks);

		scope.users = {};
		scope.userKeys = [];

		scope.start = function() {
			pubsub.startSession(scope.room);
			pubsub.subscribe(trackUser);
			Leap.loop({ enableGestures: true, background: true }, detectMotions);
			scope.started = true;
			users.session.alias = scope.alias;
		};

		function trackUser(msg) {
			var user = msg.user;
			scope.$apply(function(){
				var exists = scope.users.hasOwnProperty(user.alias);
				if (user.controlsStems()) {
					if (!exists) scope.userKeys.push(user.alias);
					scope.users[user.alias] = user;
				} else if (exists) {
					scope.userKeys.splice(scope.userKeys.indexOf(user.alias), 1);
					delete scope.users[user.alias];
				}
			});
		}

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
				var index = parseInt(window.location.hash.substr(1), 10);
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