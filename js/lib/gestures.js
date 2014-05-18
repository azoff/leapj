define(function(){

	function adjustFilter(value, scope) {

		value = value * 20000; // max in Hz

		switch(value.hand) {

			//lowpass
			case 'left':
				scope.filterNode.type = scope.filterNode.LOWPASS;
				break;
			//highpass
			case 'right':
				scope.filterNode.type = scope.filterNode.HIGHPASS;
				break;
			//bandpass
			case '':
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
		console.log(msg);
		if (msg.type in recognizers) {
			recognizers[msg.type](msg.value, scope);
		}
	}

	return exports;


});