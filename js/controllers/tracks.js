define(['require'], function(require){

	"use strict";

	return function(scope) {

		define('scope/tracks', scope);

		require(['data/tracks'], loadTracks);

		scope.start = function() {
			scope.selectedTrack = scope.tracks[0];
		};

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