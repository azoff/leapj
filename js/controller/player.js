define(['require', 'angular'], function(require, angular){

	"use strict";

	return function(player) {

		define('scope/player', player);

		require(['scope/tracks'], watchSelectedTrack);

		player.playSelectedTrack = function() {
			angular.forEach(player.selectedTrack.stems, playStem);
			player.playing = true;
		};

		player.stopSelectedTrack = function() {
			angular.forEach(player.selectedTrack.stems, stopStem);
			player.playing = true;
		};

		function watchSelectedTrack(tracks) {
			player.selectedTrack = tracks.selectedTrack;
			tracks.$watch('selectedTrack', changeSelectedTrack);
		}

		function changeSelectedTrack(selectedTrack) {
			player.selectedTrack = selectedTrack;
			player.ready = true;
		}

		function playStem(stem) {
			stem.play();
		}

		function stopStem(stem) {
			stem.stop();
		}


	}

});
