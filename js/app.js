(function(){

	"use strict";

	requirejs.config({
		paths: {
			jquery: 'jquery-2.1.1/jquery.min',
			angular: 'angular-1.2.15/angular',
			firebase: 'firebase-1.0.15/firebase',
			detectors: 'core/detectors',
			gestures: 'core/gestures',
			pubsub: 'core/pubsub',
			visuals: 'core/visuals',
			audio: 'core/audio',
			fingerprint: 'fingerprint/fingerprint',
			three: 'leap/three',
			leap: 'leap/leap-0.6.0',
			leapPlugins: 'leap/leap-plugins-0.1.6',
			leapHand: 'leap/leap.rigged-hand-0.1.4.min'
		},
		shim: {
			angular: {
				deps: ['jquery'],
				exports: 'angular'
			},
			three: {
				exports: 'THREE'
			},
			leap: {
				exports: 'Leap'
			},
			leapPlugins: {
				exports: 'Leap'
			},
			leapHand: {
				deps: ['leap', 'leapPlugins', 'three'],
				exports: 'Leap'
			},
			firebase: {
				exports: 'Firebase'
			}
		}
	});

	// set up angular JS
	// https://code.angularjs.org/1.2.1/docs/guide/bootstrap
	window.name = "NG_DEFER_BOOTSTRAP!";
	require(['jquery', 'angular'], function($, angular){

		// load in track data
		define('data/tracks', $.getJSON('/data/tracks.json'));

		// declare all controllers
		var controllers = [];
		var root = $('[ng-app]');
		var name = root.attr('ng-app');
		var module = angular.module(name, []);
		define('module/'+name, module);
		root.find('[ng-controller]').each(function(_, el){
			var name = $(el).attr('ng-controller');
			var job = $.Deferred();
			controllers.push(job.promise());
			require(['controllers/'+name], function(controller){
				module.controller(name, ['$scope', '$element', controller]);
				job.resolve();
			})
		});

		// finish bootstrap when all controllers load
		$.when.apply($, controllers).done(function(){
			angular.resumeBootstrap([module.name]);
			root.addClass('ready');
		});

	});

})();