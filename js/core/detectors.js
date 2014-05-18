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

	return {
		space: spaceMotionDetector,
		pinch: pinchMotionDetector
	};

});