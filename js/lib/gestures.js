define(function(){

	function adjustFilter(value, scope) {

		value = value * 20000; // max in Hz

		switch(type) {

			//lowpass
			case 0:
				scope.filterNode.type = scope.filterNode.LOWPASS;
				break;
			//highpass
			case 1:
				scope.filterNode.type = scope.filterNode.HIGHPASS;
				break;
			//bandpass
			case 2:
			default:
				scope.filterNode.type = scope.filterNode.BANDPASS;
				break;
		}

		scope.filterNode.frequency.value = value;
	}

	function adjustGain(value, scope) {
		scope.gainNode.gain.value = Math.max(0, Math.min(1, value));
	}

	var exports = {
		processMessage: processMessage
	};

	var recognizers = {
		space: spaceRecognizer
	}

	function spaceRecognizer(event, scope) {
		adjustFilter(event.x, scope);
		adjustGain(event.y, scope);
	}

	function processMessage(msg, scope) {
		if (msg.type in recognizers) {
			recognizers[msg.type](msg.value, scope);
		}
	}

	return exports;


});