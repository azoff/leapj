define(['require', 'angular'], function(require, angular){

	"use strict";

	return function(player) {

		var urlToStems = {};
		var stemIdToPrints = {};
		var printsToStemIds = {};
		var promises = [];

		require(['scope/tracks'], watchSelectedTrack);

		player.playSelectedTrack = function() {
			if (player.selectedTrack) {
				angular.forEach(player.selectedTrack.stems, loadStem);
				$.when.apply($, promises).done(function(){
					angular.forEach(player.selectedTrack.stems, playStem);
					player.playing = true;
				});
			}
		};

		player.stopSelectedTrack = function() {
			if (player.selectedTrack) {
				angular.forEach(player.selectedTrack.stems, stopStem);
				player.playing = false;
			}
		};

		player.registerStem = function(stem) {
			urlToStems[stem.url] = stem;
			if (Object.keys(urlToStems).length === Object.keys(player.selectedTrack.stems).length) {
				player.playSelectedTrack();
			}
		};

		player.registerPrint = function(print, stem) {
			stemIdToPrints[stem.$id] = print;
			printsToStemIds[print] = stem.$id;
		};

		player.stemIdByPrint = function(print) {
			return printsToStemIds[print];
		};

		player.printByStem = function(stem) {
			return stemIdToPrints[stem.$id];
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
			stemIdToPrints = {};
			printsToStemIds = {};
			player.selectedTrack = selectedTrack;
		}

		function loadStem(url) {
			if (url in urlToStems) {
				promises.push(urlToStems[url].load());
			}
		}

		function playStem(url) {
			if (url in urlToStems) {
				urlToStems[url].play();
			}
		}

		function stopStem(url) {
			if (url in urlToStems) {
				urlToStems[url].stop();
			}
		}

		define('scope/player', player);

	}

});
