define(['exports'], function(exports){

	var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;

	function randomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function randomLightenRGB(rgb) {
		var lighten = randomInt(60, 85);
		return [
			Math.min(rgb[0] + lighten, 255),
			Math.min(rgb[1] + lighten, 255),
			Math.min(rgb[2] + lighten, 255)
		];
	}

	function intToHex(c) {
		var hex = c.toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	}

	function rgbToHex(rgb) {
		return "#" + intToHex(rgb[0]) + intToHex(rgb[1]) + intToHex(rgb[2]);
	}

	var Visualizer = exports.Visualizer = function(canvas, player) {
		this._player = player;
		this._canvas = canvas;
		this._context = canvas.get(0).getContext('2d');
		this.setBaseColor([0, 169, 224]);
	};

	Visualizer.prototype.setBaseColor = function(rgb) {
		var base = rgbToHex(rgb);
		var lighten = rgbToHex(randomLightenRGB(rgb));
		var gradient = this._context.createLinearGradient(0, 0, 0, this._canvas.height());
		gradient.addColorStop(0, lighten);
		gradient.addColorStop(1, base);
		this._context.fillStyle = gradient;
		this._context.strokeStyle = '#EEE';
	};

	Visualizer.prototype.draw = function(analyser) {

		var height = this._context.height = this._canvas.height();
		var width  = this._context.width = this._canvas.width();

		var frequencies = new Uint8Array(analyser.frequencyBinCount);
		analyser.getByteFrequencyData(frequencies);

		var timeDomains = new Uint8Array(analyser.frequencyBinCount);
		analyser.getByteTimeDomainData(timeDomains);

		var spectralLineSpacing = 0.75;
		var spectralLineCount   = analyser.fftSize / 2;
		var spectralLineWidth   = width / (spectralLineCount + spectralLineSpacing);
		var timingLineWidth     = width / spectralLineCount;
		var frequencyCount      = frequencies.length;

		this._context.clearRect(0, 0, width, height);
		this._context.beginPath();

		for (var j=0; j<frequencyCount; j++) {

			// draw the spectral line
			var spectralLineX = j * (spectralLineWidth + spectralLineSpacing);
			var spectralLineHeight = (frequencies[j]/255) * height;
			var spectralLineY = height - spectralLineHeight;
			this._context.fillRect(spectralLineX, spectralLineY, spectralLineWidth, spectralLineHeight);

			var percent = timeDomains[j]/255;
			var offset = height - (percent * height) - 1;
			this._context.lineTo(j * timingLineWidth, offset);
		}

		this._context.stroke();

	};

	Visualizer.prototype.start = function() {
		this._looping = true;
		this.loop();
	};

	Visualizer.prototype.stop = function() {
		this._looping = false;
	};

	Visualizer.prototype.looper = function() {
		var stem = this;
		return function() { stem.loop(); };
	};

	Visualizer.prototype.loop = function() {
		var analyser = this._player.analyser;
		if (analyser) this.draw(analyser);
		if (this._looping)
			requestAnimationFrame(this.looper());
	};

	exports.randomNeutralRGB = function() {
		return [
			randomInt(85, 170),
			randomInt(85, 170),
			randomInt(85, 170)
		];
	}

});