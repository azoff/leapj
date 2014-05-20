define(['require', 'angular', 'audio', 'jquery'], function(require, angular, audio, $){

	"use strict";

	return function(scope) {

		var promises  = [];
		scope.stems   = [];
		scope.playing = false;
		scope.$watch('selectedTrack', changeTrack);
		scope.$watch('mode', togglePlayback);

		function togglePlayback(mode) {
			if (mode === 'receiving' && !scope.playing) play();
			else if (scope.playing) stop();
		}

		function changeTrack(track) {
			if (scope.playing) stop();
			scope.stems = [];
			if (track) loadStems(track);
		}

		function loadStems(track) {
			promises = [];
			angular.forEach(track.stems, loadStem);
		}

		function loadStem(url, name) {
			var stem = new audio.Stem(name, url);
			scope.stems.push(stem);
			promises.push(stem.promise);
		}

		function whenStemsLoaded() {
			return $.when.apply($, promises);
		}

		function play() {
			whenStemsLoaded().done(function(){
				angular.forEach(scope.stems, function(stem){
					stem.player.play();
				});
				scope.playing = true;
			});
		}

		function stop() {
			angular.each(scope.stems, function(stem){
				stem.player.stop();
			});
			scope.playing = false;
		}

	}

});
