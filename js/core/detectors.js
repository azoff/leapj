define(['jquery', 'leap'], function($, Leap){

	"use strict";

	function debounce(l, max) {
		var timestamp = Date.now();
		var delta = timestamp - l._lastTimestamp;
		if (delta <= max) return true;
		l._lastTimestamp = timestamp;
		return false;
	}

	function normalize(value, min, max) {
		var factor = Math.pow(10, 2);
		var range = max - min;
		value = (value - min) / range;
		value = Math.round(value * factor) / factor;
		value = Math.max(Math.min(value, 1), 0);
		return value;
	}

	function closestFingerToThumb(hand) {

		var closest = 500;
		var current, distance, index;

		for (var i=0; i<5; i++) {
			if (current === hand.thumb) continue;
			current = hand.fingers[i];
			distance = Leap.vec3.distance(hand.thumb.tipPosition, current.tipPosition);
			if (distance >= closest) continue;
			closest = distance;
			index = i;
		}

		return index;

	}

	function pinchMotionDetector(frame, callback) {

		if (!frame.hands[0] && !frame.hands[1])
			return;

		$.each(frame.hands, function(_, hand){
			var pinchStrength = hand.pinchStrength.toPrecision(2);
			if (!pinchMotionDetector.pinched && pinchStrength > 0.8) {
				pinchMotionDetector.pinched = true;
				pinchMotionDetector.pinchedFinger = closestFingerToThumb(hand);
				callback({
					type: 'pinch-start',
					finger: pinchMotionDetector.pinchedFinger,
					hand: hand.type
				});
			} else if (pinchMotionDetector.pinched && pinchStrength < 0.4) {
				pinchMotionDetector.pinched = false;
				callback({
					type: 'pinch-stop',
					finger: pinchMotionDetector.pinchedFinger,
					hand: hand.type
				});
			}
		});

	}

	function spaceMotionDetector(frame, callback) {

		if (!frame.hands[0] && !frame.hands[1])
			return;

		if (debounce(spaceMotionDetector, 50))
			return;

		$.each(frame.hands, function(_, hand){
			callback({
				type: 'space',
				x: normalize(hand.palmPosition[0], -80, 90),
				y: normalize(hand.palmPosition[1], 55, 200),
				z: normalize(hand.palmPosition[2], -100, 80),
				hand: hand.type
			});
		});
	}

	function triangleMotionDetector(frame, callback) {
		if (!frame.hands[0] || !frame.hands[1]) {
			if (triangleMotionDetector.triangleEngaged) {
				triangleMotionDetector.triangleEngaged = false;
				callback({
					type: 'triangle-stop'
				});
			}
			return;
		}

		if (debounce(triangleMotionDetector, 50))
			return;

		// Right now, this checks if your two thumbs are close together.
		var distance = Leap.vec3.distance(frame.hands[0].thumb.tipPosition, frame.hands[1].thumb.tipPosition);

		if (!triangleMotionDetector.triangleEngaged && distance < 65) {
			triangleMotionDetector.triangleEngaged = true;
			callback({
				type: 'triangle-start'
			});
		} else if (triangleMotionDetector.triangleEngaged && distance > 75) {
			triangleMotionDetector.triangleEngaged = false;
			callback({
				type: 'triangle-stop'
			});
		}
	}

	function computeSwipe(gesture) {
		// Classify swipe as either horizontal or vertical
		var swipeDirection;
		var isHorizontal = Math.abs(gesture.direction[0]) > Math.abs(gesture.direction[1]);
		// Classify as right-left or up-down
		if(isHorizontal){
			if(gesture.direction[0] > 0){
				swipeDirection = 'right';
			} else {
				swipeDirection = 'left';
			}
		} else { //vertical
			if(gesture.direction[1] > 0){
				swipeDirection = 'up';
			} else {
				swipeDirection = 'down';
			}
		}

		return swipeDirection;
	}

	function swipeDetector(frame, callback) {
		// type : 'swipe'
		// direction : ('left', 'right', 'up', 'down')
		if (frame.gestures.length > 0) {
			var swipes = []
			for (var i = 0; i < frame.gestures.length; i++) {
				var gesture = frame.gestures[i];
				if (gesture.type == 'swipe') {
					if (debounce(swipeDetector, 600)) { return };
					var swipeDirection = computeSwipe(gesture);
					callback({
						'type': 'swipe',
						'direction' :  swipeDirection
					});
					return;
				}
			}
		}
  }

	return {
		space: spaceMotionDetector,
		pinch: pinchMotionDetector,
		triangle: triangleMotionDetector,
		swipe: swipeDetector
	};

});