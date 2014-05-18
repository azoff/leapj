define(function(){

	function adjustFilter(value, filter_type, scope) {

		if (!scope.filterNode) return;
		var filter = '';

		switch(filter_type) {

			//lowpass
			case 'low':
				filter = 'lowpass';
				scope.filterNode.type = scope.filterNode.LOWPASS;
				break;
			//highpass
			case 'high':
				filter = 'highpass';
				scope.filterNode.type = scope.filterNode.HIGHPASS;
				break;
			//bandpass
			case '':
			default:
				filter = 'bandpass';
				scope.filterNode.type = scope.filterNode.BANDPASS;
				break;
		}

		var newValue = value * 10000
		scope.filterNode.frequency.value = newValue; // max in Hz
//		console.log('adjusting', filter, 'for', scope.key, 'to', newValue);
	}

	function adjustGain(value, scope) {
		if (!scope.gainNode) return;
		var value = Math.max(0, Math.min(1, value));
		scope.gainNode.gain.value = value;
//		console.log('adjusting volume for', scope.key, 'to', value);
	}

	function adjustPan(x, y, z, scope) {
		if (!scope.gainNode) return;

		var scale = 10;
		x = x*scale - scale/2;
		y = y*scale - scale/2;
		z = z*scale - scale/2;

		scope.panNode.setPosition(x, y, z);
//		console.log('adjusting pan', 'for', scope.key, 'to', x, y, z);
	}

	var exports = {
		processMessage: processMessage
	};

	var recognizers = {
		space: spaceRecognizer
	}

	function spaceRecognizer(value, scope) {
		if (value.hand == 'left') {
			adjustFilter(value.x, 'low', scope);
			adjustGain(value.y, scope);
			// adjustPan(value.x, value.y, value.z, scope);

		} else { // Right hand
			// adjustFilter(value.x, 'high', scope);
			adjustFilter(value.x, 'low', scope);
			adjustGain(value.y, scope);
		}

	}

	function processMessage(msg, scope) {
		if (msg.type in recognizers) {
			recognizers[msg.type](msg, scope);
		}
	}

	return exports;


});
