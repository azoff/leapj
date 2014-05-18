window.onload = init();

var playing = false;
var source;

function playPause(){
	playing = !playing;


	if(playing == false){
		console.log("stop playing.")
		source.stop(0);
		
	}
	else if(playing == true){
		console.log("start playing.")
		source.start(0);
		
	}

}


function init ()
{
if (typeof AudioContext == "function") {
    var audioContext = new AudioContext();
} else if (typeof webkitAudioContext == "function") {
    var audioContext = new webkitAudioContext();
}


source = audioContext.createBufferSource();
var gainNode = audioContext.createGain();

source.connect(gainNode);
gainNode.connect(audioContext.destination);

var playButton = document.getElementById("play");
playButton.onclick = playPause;


var xhr = new XMLHttpRequest();
				// insert file from 
				//local direc. here
xhr.open("GET", "counting1.wav", true);
xhr.responseType = "arraybuffer";
xhr.onload = function() {
    var buffer = audioContext.createBuffer(xhr.response, false);
    source.buffer = buffer;
    
};

xhr.send();
}



