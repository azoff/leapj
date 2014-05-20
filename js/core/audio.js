define(['jquery', 'exports'], function($, exports){

	var AudioContext = window.AudioContext || window.webkitAudioContext;

	// audio API
	var api = new AudioContext();
	var speakers = api.destination;
	api.createGain = api.createGain || api.createGainNode;

	function defaultMiddleware(source) {
		return source;
	}

	var download = exports.download = function(url) {
		var def = $.Deferred();
		var request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType = 'arraybuffer';
		request.onload = function() {
			api.decodeAudioData(request.response, def.resolve);
		};
		request.send();
		return def.promise();
	};

	var Player = exports.BufferSource = function(buffer, middleware) {
		this._buffer = buffer;
		this._middleware = $.isFunction(middleware) ? middleware : defaultMiddleware;
	};

	Player.prototype.play = function(startTime) {
		var offset = startTime ? ((new Date().getTime()/1000) - startTime) : 0;
		var source = this._source = api.createBufferSource(); source.buffer = this._buffer;
		this._middleware(source).connect(speakers);
		source.start(0, offset);
	};

	Player.prototype.stop = function() {
		if (!this._source) return;
		this._source.stop(0);
		delete this._source;
	};

	Player.prototype.isPlaying = function() {
		return !!this._source;
	};

	var Stem = exports.Stem = function(name, url) {
		var stem     = this;
		stem.name    = name;
		stem.key     = name;
		stem.url     = url;
		stem.promise = download(url).done(function(b){
			stem.setBuffer(b);
			return stem;
		});
	};

	Stem.prototype.setupMiddleware = function(source) {

		// create adjustment filters
		this.gainNode = api.createGain();           // volume control
		this.panNode = api.createPanner();          // 3D pan filter
		this.filterNode = api.createBiquadFilter(); // biquad filter
		this.filterNode.type = this.filterNode.ALLPASS;

		// create an audio analyser
		this.analyser = api.createAnalyser();
		this.analyser.smoothingTimeConstant = 0.6;
		this.analyser.fftSize = 256;

		// pass the audio data into the filters
		source.connect(this.panNode);
		this.panNode.connect(this.gainNode);
		this.gainNode.connect(this.filterNode);
		this.filterNode.connect(this.analyser);

		// return the last node in the chain
		return this.analyser;

	};

	Stem.prototype.setBuffer = function(buffer) {
		if (this.player && this.player.isPlaying())
			this.player.stop();
		this.player = new Player(buffer, this.setupMiddleware);
	};

	Stem.prototype.ready = function() {
		return !!this._player;
	};

});