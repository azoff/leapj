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
        /*
        "https://s3.amazonaws.com/leapj-assets/audio/with_stems/Queen - We Will Rock You/drums.ogg",
        "https://s3.amazonaws.com/leapj-assets/audio/with_stems/Queen - We Will Rock You/guitar.ogg",
        "https://s3.amazonaws.com/leapj-assets/audio/with_stems/Queen - We Will Rock You/rhythm.ogg",
        "https://s3.amazonaws.com/leapj-assets/audio/with_stems/Queen - We Will Rock You/song.ogg",
        */

//        "/audio/no_stems/Backstreet Boys - Everybody (Backstreet's Back)-6M6samPEMpM.mp4",

/*
        "http://s3.amazonaws.com/leapj-assets/audio/with_stems/Lady%20Gaga%20-%20Bad%20Romance/Bass.mp3",
        "http://s3.amazonaws.com/leapj-assets/audio/with_stems/Lady%20Gaga%20-%20Bad%20Romance/Drum.mp3",
        "http://s3.amazonaws.com/leapj-assets/audio/with_stems/Lady%20Gaga%20-%20Bad%20Romance/Lead.mp3",
        "http://s3.amazonaws.com/leapj-assets/audio/with_stems/Lady%20Gaga%20-%20Bad%20Romance/Synth.mp3",
        "http://s3.amazonaws.com/leapj-assets/audio/with_stems/Lady%20Gaga%20-%20Bad%20Romance/Voice.mp3",
        */
        "/audio/with_stems/Lady%20Gaga%20-%20Bad%20Romance/Bass.mp3",
        "/audio/with_stems/Lady%20Gaga%20-%20Bad%20Romance/Drum.mp3",
        "/audio/with_stems/Lady%20Gaga%20-%20Bad%20Romance/Lead.mp3",
        "/audio/with_stems/Lady%20Gaga%20-%20Bad%20Romance/Synth.mp3",
        "/audio/with_stems/Lady%20Gaga%20-%20Bad%20Romance/Voice.mp3",

/*
        "https://s3.amazonaws.com/leapj-assets/audio/with_stems/Beatles%20-%20Sgt%20Pepper/Beatles%20-%20Sgt%20Pepper%20-%20drum.mp3",
        "https://s3.amazonaws.com/leapj-assets/audio/with_stems/Beatles%20-%20Sgt%20Pepper/Beatles%20-%20Sgt%20Pepper%20-%20guiter.mp3",
        "https://s3.amazonaws.com/leapj-assets/audio/with_stems/Beatles%20-%20Sgt%20Pepper/Beatles%20-%20Sgt%20Pepper%20-%20horns.mp3",
        "https://s3.amazonaws.com/leapj-assets/audio/with_stems/Beatles%20-%20Sgt%20Pepper/Beatles%20-%20Sgt%20Pepper%20-%20voice.mp3",
        */
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
        stems[i].panNode = audioContext.createPanner(); // pan filter

        // connections
        stems[i].source.connect(stems[i].filterNode);
        stems[i].filterNode.connect(stems[i].panNode);
        stems[i].panNode.connect(stems[i].gainNode);
        stems[i].gainNode.connect(audioContext.destination);
    }
    $("#play").show();
    $("#loading").hide();
}

function filter(stem, type, value) {
    //value = Math.log(value+1) * 20000;
    value = value * 20000; // max in Hz

    switch(type) {
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
}

function gain(stem, value) {
    value = Math.max(0, value)
    value = Math.min(1, value)
    stems[stem].gainNode.gain.value = value;
}

function pan(stem, x, y, z) {
    var scale = 10
    x = x*scale - scale/2
    y = y*scale - scale/2
    z = z*scale - scale/2
    stems[stem].panNode.setPosition(x, y, z);
}

var gestures = {
    // leapmotion events
    "space": function(value) {
        //console.log('space', value.x)
        var stem = 0
        var type = 0
        filter(stem, type, value.x)
        gain(stem, value.y)
    },
}