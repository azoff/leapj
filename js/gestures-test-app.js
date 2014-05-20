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
			user: 'core/user',
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

	require(['jquery', 'leap', 'detectors'], function($, Leap, detectors) {
		function publishMotionEvent(event) {
			console.log(event.type);
		}

		function detectMotions(frame) {
			detectors.space(frame, publishMotionEvent);
			detectors.pinch(frame, publishMotionEvent);
			detectors.triangle(frame, publishMotionEvent);
		}

		Leap.loop({ enableGestures: true, background: true }, detectMotions);
	});

})();