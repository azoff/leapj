define(['require', 'angular'], function(require, angular){

	"use strict";

	return function(player) {

		var stems = {};
		var promises = [];

		require(['scope/tracks'], watchSelectedTrack);

		player.playSelectedTrack = function() {
			if (player.selectedTrack) {
				angular.forEach(player.selectedTrack.stems, playStem);
				player.playing = true;
			}
		};

		player.stopSelectedTrack = function() {
			if (player.selectedTrack) {
				angular.forEach(player.selectedTrack.stems, stopStem);
				player.playing = false;
			}
		};

		player.registerStem = function(url, stem) {
			stems[url] = stem;
			player.ready = true;
			//player.playSelectedTrack();
		};

		function watchSelectedTrack(tracks) {
			player.selectedTrack = tracks.selectedTrack;
			tracks.$watch('selectedTrack', changeSelectedTrack);
		}

		function changeSelectedTrack(selectedTrack) {
			if (player.playing)
				player.stopSelectedTrack();
			player.ready = false;
			promises = [];
			player.selectedTrack = selectedTrack;
		}

		function playStem(stem) {
			if (stem in stems) {
				stems[stem].play();
			}
		}

		function stopStem(stem) {
			if (stem in stems) {
				stems[stem].stop();
			}
		}

		define('scope/player', player);

	}

});
