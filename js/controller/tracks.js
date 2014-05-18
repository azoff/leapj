define(['require'], function(require){

	"use strict";

	return function(scope) {

		define('scope/tracks', scope);

		require(['data/tracks'], loadTracks);

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