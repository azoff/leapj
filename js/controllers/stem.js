window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
window.AudioContext = window.AudioContext || window.webkitAudioContext;

define(['require', 'gestures', 'jquery'], function(angular, gestures, $){

	"use strict";

	var audio = createAudioContext();

	var users = {
		'3955887555': { name: 'jon', role: 'keys', master: true },
		'1106381882': { name: 'aylan', role: 'bass' },
		'4225483771': { name: 'nathan', role: 'vocals'},
		'157016914':  { name: 'joseph', role: 'goblins' }
	};

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
		loadBuffer(scope.url, applyBuffer);

		require(['pubsub'], function(pubsub){
			pubsub.subscribe(processMessage);
		});

		scope.load = function() {
			return def.promise();
		};

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
		};

		function acceptsUser(user) {
			if (user.role === scope.key) {
				scope.$apply(function(){
					scope.key = user.name;
				});
				return true;
			}
			return user.master || user.name === scope.key;
		}

		function acceptPrint(print, player) {
			if (print in users) {
				return acceptsUser(users[print]);
			} else {
				var rid = player.stemIdByPrint(print);
				var rprint = player.printByStem(scope);
				if (!rid && !rprint) {
					player.registerPrint(print, scope);
					return true;
				} else {
					return rid === scope.$id;
				}
			}
		}

		function processMessage(msg) {
			require(['scope/player'], function(player) {
				if (!acceptPrint(msg.fingerprint, player)) return;
				console.log(msg.fingerprint, scope.key);
				gestures.processMessage(msg, scope);
			});
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
			scope.panNode = audio.createPanner();          // 3D pan filter
			scope.filterNode = audio.createBiquadFilter(); // biquad filter
			scope.filterNode.type = scope.filterNode.ALLPASS;

			// create an audio analyser
			scope.analyser = audio.createAnalyser();
			scope.analyser.smoothingTimeConstant = 0.6;
			scope.analyser.fftSize = 256;

			// pass the audio data into the filters
			scope.bufferSource.connect(scope.panNode);
			scope.panNode.connect(scope.gainNode);
			scope.gainNode.connect(scope.filterNode);
			scope.filterNode.connect(scope.analyser);
			scope.analyser.connect(audio.destination);

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

		require(['scope/player'], function(player){
			player.registerStem(scope);
		});

	}

});
