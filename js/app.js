(function(){

	"use strict";

	requirejs.config({
		paths: {
			jquery: '//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min',
			angular: '//ajax.googleapis.com/ajax/libs/angularjs/1.2.15/angular.min',
			firebase: '//cdn.firebase.com/js/client/1.0.15/firebase.js'
		},
		shim: {
			angular: {
				exports: 'angular'
			},
			firebase: {
				exports: 'firebase'
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