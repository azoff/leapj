define(function(){

	function adjustFilter(value, filterType, stem) {

		if (!stem.player.filterNode) return;

		var filter = '';

		switch(filterType) {

			//lowpass
			case 'low':
				filter = 'lowpass';
				stem.player.filterNode.type = stem.player.filterNode.LOWPASS;
				break;
			//highpass
			case 'high':
				filter = 'highpass';
				stem.player.filterNode.type = stem.player.filterNode.HIGHPASS;
				break;
			//bandpass
			case '':
			default:
				filter = 'bandpass';
				stem.player.filterNode.type = stem.player.filterNode.BANDPASS;
				break;
		}

		var newValue = value * 10000
		stem.player.filterNode.frequency.value = newValue; // max in Hz
//		console.log('adjusting', filter, 'for', stem.name, 'to', newValue);
	}

	function adjustGain(value, stem) {
		if (!stem.player.gainNode) return;
		var value = Math.max(0, Math.min(1, value));
		stem.player.gainNode.gain.value = value;
//		console.log('adjusting volume for', stem.name, 'to', value);
	}

	function adjustPan(x, y, z, stem) {
		if (!stem.player.panNode) return;
		var scale = 10;
		x = x*scale - scale/2;
		y = y*scale - scale/2;
		z = z*scale - scale/2;

		stem.player.panNode.setPosition(x, y, z);
//		console.log('adjusting pan', 'for', stem.name, 'to', x, y, z);
	}

	var exports = {
		processMessage: processMessage
	};

	var recognizers = {
		space: spaceRecognizer,
		'pinch-start': pinchStartRecognizer,
		'pinch-stop': pinchStopRecognizer

	}

	function pinchStartRecognizer(value, stem) {
		if (value.hand == 'left') {
			adjustGain(0, stem);
			adjustFilter(0, 'low', stem);
		}
	}

	function pinchStopRecognizer(value, stem) {
		if (value.hand == 'left') {
			adjustGain(1, stem);
			adjustFilter(1, 'low', stem);
		}
	}

	function spaceRecognizer(value, stem) {
		if (value.hand == 'right') {
			adjustFilter(value.x, 'low', stem);
			adjustGain(value.y, stem);
		} else if (value.hand == 'left') {
			adjustFilter(1 - value.x, 'band', stem); // invert
		}
	}

	function processMessage(msg, stem) {
		if (!stem.player) return;
		if (msg.type in recognizers) {
			recognizers[msg.type](msg, stem);
		}
	}

	return exports;


});
