define(function(){

	function adjustFilter(value, scope) {

		if (!scope.filterNode) return;
		var filter = '';

		switch(value.hand) {

			//lowpass
			case 'left':
				filter = 'lowpass';
				scope.filterNode.type = scope.filterNode.LOWPASS;
				break;
			//highpass
			case 'right':
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

		scope.filterNode.frequency.value = value * 20000; // max in Hz
		console.log('adjusting', filter, value * 20000);
	}

	function adjustGain(value, scope) {
		if (!scope.gainNode) return;
		var value = Math.max(0, Math.min(1, value));
		scope.gainNode.gain.value = value;
		console.log('adjusting volume', value);
	}

	function adjustPan(x, y, z, scope) {
		if (!scope.gainNode) return;

		var scale = 10;
		x = x*scale - scale/2;
		y = y*scale - scale/2;
		z = z*scale - scale/2;

		scope.panNode.setPosition(x, y, z);
		console.log('adjusting pan', x, y, z);
	}

	var exports = {
		processMessage: processMessage
	};

	var recognizers = {
		space: spaceRecognizer
	}

	function spaceRecognizer(value, scope) {
		adjustPan(value.x, value.y, value.z, scope);
		// adjustFilter(value.x, scope);
		// adjustGain(value.y, scope);
	}

	function processMessage(msg, scope) {
		if (msg.type in recognizers) {
			recognizers[msg.type](msg, scope);
		}
	}

	return exports;


});
