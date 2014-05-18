window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
window.AudioContext = window.AudioContext || window.webkitAudioContext;

define(['require', 'pubsub', 'gestures', 'jquery'], function(angular, pubsub, gestures, $){

	"use strict";

	var audio = createAudioContext();

	var i = 0;
	var colors = [
		['#00A9E0', '#67CDDC'],
		['#98C73D', '#D0DD2B'],
		['#cb4351', '#cb4395']
	];

	function createAudioContext() {
		var c = new AudioContext();
		c.createGain = c.createGain || c.createGainNode;
		return c;
	}

	function createCanvasContext(canvas) {

		var context = canvas.get(0).getContext('2d');
		var height = context.width = canvas.width();
		context.height = canvas.height();

		var gradient = context.createLinearGradient(0, 0, 0, height);
		var color = colors[i++%colors.length];

		gradient.addColorStop(0, color[0]);
		gradient.addColorStop(1, color[1]);
		context.fillStyle = gradient;
		context.strokeStyle = '#EEE';

		return context;

	}

	function loadBuffer(url, done) {
		var request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType = 'arraybuffer';
		request.onload = function() {
			audio.decodeAudioData(request.response, done);
		}
		request.send();
	}

	function renderAnalyzer(ctx, analyser, w, h) {

		if (!ctx || !analyser) return;

		var byteFreqArr = new Uint8Array(analyser.frequencyBinCount);
		analyser.getByteFrequencyData(byteFreqArr);

		var timeDomainArr = new Uint8Array(analyser.frequencyBinCount);
		analyser.getByteTimeDomainData(timeDomainArr);

		ctx.clearRect(0, 0, w, h);
		ctx.beginPath();

		var fft = analyser.fftSize;
		var fw = w / fft;

		for (var j=0, jLen=byteFreqArr.length; j<jLen; j++ ) {
			var percent = timeDomainArr[j] / fft;
			var offset = h - (percent * h) - 1;
			ctx.fillRect(j * fw, h-(byteFreqArr[j] / fft * h), (fw - 2), h);
			ctx.lineTo(j * fw, offset);
		}

		ctx.stroke();

	}

	return function(scope, el) {

		var def = $.Deferred();

		setupScope();
		pubsub.subscribe(processMessage);
		loadBuffer(scope.url, applyBuffer);
		scope.$watch('volume', adjustVolume);

		scope.play = function() {

			def.done(function(){

				scope.bufferSource = audio.createBufferSource();
				scope.bufferSource.buffer = scope.buffer;

				var bufferOffset = scope.pauseTime || 0;
				scope.startTime = audio.currentTime;

				// correct playback time
				if (scope.pauseTime > 0) {
					scope.startTime -= scope.pauseTime;
				}

				// start playback
				if (scope.bufferSource.start) {
					scope.bufferSource.start(0, bufferOffset);
				} else {
					scope.bufferSource.noteGrainOn(0, bufferOffset, 180);
				}

				resetAudioComponents();

			});

		}

		scope.stop = function() {
			def.done(function(){
				if (scope.bufferSource.stop) {
					scope.bufferSource.stop(0);
				} else {
					scope.bufferSource.noteOff(0);
				}
				scope.pauseTime = audio.currentTime - scope.startTime;
			});
		}

		function processMessage(msg) {
			gestures.processMessage(msg, scope);
		}

		function setupScope() {
			scope.volume = 100;
			scope.loading = true;
			scope.canvas = el.find('canvas');
			scope.canvasCtx = createCanvasContext(scope.canvas);
		}

		function resetAudioComponents() {

			// create adjustment filters
			scope.gainNode = audio.createGain();           // volume control
			scope.filterNode = audio.createBiquadFilter(); // biquad filter
			scope.reverbNode = audio.createConvolver();    // reverb

			// create an audio analyser
			scope.analyser = audio.createAnalyser();
			scope.analyser.smoothingTimeConstant = 0.6;
			scope.analyser.fftSize = 256;

			// pass the audio data into the filters
			scope.bufferSource.connect(scope.gainNode);
			scope.bufferSource.connect(scope.filterNode);
			scope.bufferSource.connect(scope.reverbNode);

			// pass the filter outputs into the analyser
			scope.gainNode.connect(scope.analyser);
			scope.filterNode.connect(scope.analyser);
			scope.reverbNode.connect(scope.analyser);

			// pass the filter outputs to the speakers
			scope.gainNode.connect(audio.destination);
			scope.filterNode.connect(audio.destination);
			scope.reverbNode.connect(audio.destination);

		}

		function applyBuffer(buffer) {
			scope.$apply(function(){
				scope.ready = true;
				scope.loading = false;
				scope.buffer = buffer;
			});
			renderLoop();
			def.resolve(scope)
		}

		function renderLoop() {
			renderAnalyzer(scope.canvasCtx, scope.analyser, el.width()*2, el.height());
			window.requestAnimationFrame(renderLoop);
		}

		function adjustVolume(volume){
			var value = volume / 100;
			if (scope.gainNode) {
				scope.gainNode.gain.value = value;
			}
		}

		require(['scope/player'], function(player){
			player.registerStem(scope.url, scope);
		});

	}

});