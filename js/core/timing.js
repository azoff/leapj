define(['audio'], function(audio){

	var lookahead = 5;

	function newUnixTimestamp() {
		return (new Date).getTime();
	}

	function newAudioTimestamp() {
		return audio.currentAdjustedTime();
	}

	function newAdjustedUnixTimestamp() {
		return newUnixTimestamp() + lookahead*1000;
	}

	function newAdjustedAudioTimestamp() {
		return newAudioTimestamp() + lookahead;
	}

	function Timestamp(ts) {
		ts = ts || {};
		this.unix = ts.unix || newAdjustedUnixTimestamp();
		this.audio = ts.audio || newAdjustedAudioTimestamp();
	}

	return {
		Timestamp: Timestamp
	}

});