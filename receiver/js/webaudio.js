window.onload = init();

var playing = false;
var stems = []; // Will contain .source, .gainNode, other filters as implemented

function playPause(){
	playing = !playing;

	if(playing == false){
		console.log("stop playing.")
        for (var i = 0; i < stems.length; i++) {
            stems[i].source.stop(0);
        }
	}
	else if(playing == true){
		console.log("start playing.")
        for (var i = 0; i < stems.length; i++) {
            stems[i].source.start(0);
        }
	}
}
function volume(data){
	gainNode.gain.value = data.level;
}

function setGain(param){
	gainNode.gain.value = param;
}


var audioContext;
function init ()
{
    if (typeof AudioContext == "function") {
        audioContext = new AudioContext();
        console.log("AudioContext");
    } else if (typeof webkitAudioContext == "function") {
        audioContext = new webkitAudioContext();
        console.log("webkitAudioContext");
    } else {
        console.log("COULD NOT LOAD AUDIO CONTEXT");
    }
    // make sure all modification node are already connected, and those paramaters ARE GLOBALLY AVAILABLE

    var playButton = document.getElementById("play");
    playButton.onclick = playPause;
    $("#play").hide();      // Hide until buffering is done
    $("#loading").show();

    bufferLoader = new BufferLoader(
        audioContext,
        [
        "https://s3.amazonaws.com/musicstems/Queen - We Will Rock You/drums.ogg",
        "https://s3.amazonaws.com/musicstems/Queen - We Will Rock You/guitar.ogg",
        "https://s3.amazonaws.com/musicstems/Queen - We Will Rock You/rhythm.ogg",
        "https://s3.amazonaws.com/musicstems/Queen - We Will Rock You/song.ogg",
        ],
        finishedLoading
    );

    bufferLoader.load();
}

function finishedLoading(bufferList) {
    stems = [];
    for (var i = 0; i < bufferList.length; i++) {
        console.log(audioContext);
        stems.push({});

        // sources
        stems[i].source = audioContext.createBufferSource();
        stems[i].source.buffer = bufferList[i];

        // filter chain
        stems[i].gainNode = audioContext.createGain(); // gain
        stems[i].filterNode = audioContext.createBiquadFilter(); // biquad filter
        stems[i].reverbNode = audioContext.createConvolver(); // reverb

        // connections
        stems[i].source.connect(stems[i].filterNode);
        stems[i].filterNode.connect(stems[i].gainNode);
        stems[i].gainNode.connect(audioContext.destination);
    }
    $("#play").show();
    $("#loading").hide();
}

var audioevent = {
    "on": function(event) {
    },
    "off": function(event) {
    },
    "start": function(event) {
    },
    "filter": function(event) {
        type = event.filterType
        value = event.value
        stem = event.stem

	if(value==0){
	    value = 200;
	} else{
	    value = Math.log(value+1) * 10000;
	}
 	switch(type){
 	    //lowpass
 	case 0:
 	    stems[stem].filterNode.type = stems[stem].filterNode.LOWPASS;
 	    break;
 	    //highpass
 	case 1:
 	    stems[stem].filterNode.type = stems[stem].filterNode.HIGHPASS;
 	    break;
 	    //bandpass
 	case 2:
 	    stems[stem].filterNode.type = stems[stem].filterNode.BANDPASS;
 	    break;
 	default:
 	    stems[stem].filterNode.type = stems[stem].filterNode.BANDPASS;
 	    break;
 	}
	stems[stem].filterNode.frequency.value = value;
	console.log(value + " is new frequency");
    },
    "volume": function(event) {
	stems[event.stem].gainNode.gain = event.value;
    },
    "eq": function(event) {
    },
    "pan": function(event) {
    },
    "reverb": function(event) {
    },
    "space": function(event) {
        console.log('space')
    },
}
