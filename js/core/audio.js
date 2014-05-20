define(['jquery', 'exports', 'user', 'tuna'], function($, exports, users, Tuna){

	var AudioContext = window.AudioContext || window.webkitAudioContext;

	// audio API
	var api = new AudioContext();
	globalAudioApi = api;
	var tuna = new Tuna(api);
	globalTuna = tuna;
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

	Player.prototype.play = function() {
		var source = this._source = api.createBufferSource(); source.buffer = this._buffer;
		this._middleware(source).connect(speakers);
		source.start(0, 0);
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

		// Tuna Effects
		// this.tremoloNode = new tuna.Tremolo({
  //     intensity: 0.3,    //0 to 1
  //     rate: 0.1,         //0.001 to 8
  //     stereoPhase: 0,    //0 to 180
  //     bypass: 1
  //   });
  //   this.wahWahNode = new tuna.WahWah({
  //     automode: true, //true/false
  //     baseFrequency: 0.5, //0 to 1
  //     excursionOctaves: 3, //1 to 6
  //     sweep: 0, //0 to 1
  //     resonance: 2, //1 to 100
  //     sensitivity: 1, //-1 to 1
  //     bypass: 1
  //   });
    this.phaserNode = new tuna.Phaser({
      rate: 1.2, //0.01 to 8 is a decent range, but higher values are possible
      depth: 0.8, //0 to 1
      feedback: 0.9, //0 to 1+
      stereoPhase: 180, //0 to 180
      baseModulationFrequency: 700, //500 to 1500
      bypass: 1
    });

    this.phaserNode.toggleBypass = function(doBypass) {
      if (doBypass) {
      	this.input.disconnect();
        this.input.connect(this.activateNode);
        if(this.activateCallback) {
            this.activateCallback(doActivate);
        }
      } else {
        this.input.disconnect();
        this.input.connect(this.output);
      }
    }

		// create an audio analyser
		this.analyser = api.createAnalyser();
		this.analyser.smoothingTimeConstant = 0.6;
		this.analyser.fftSize = 256;

		// pass the audio data into the filters
		source.connect(this.panNode);
		this.panNode.connect(this.gainNode);
		this.gainNode.connect(this.filterNode);

		var specialFxNode = this.phaserNode;
    gFxNode = specialFxNode; // TODO: remove this. for debugging
    this.filterNode.connect(specialFxNode.input)
    specialFxNode.connect(this.analyser);

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