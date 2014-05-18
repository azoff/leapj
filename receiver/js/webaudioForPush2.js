window.onload = init();

var playing = false;
var source, gainNode;
var fxList = ["gain", "filter"];

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



				//double 0 - 1.0

function volume(data){
	gainNode.gain.value = data.level;
}

function setGain(param){

	gainNode.gain.value = param;

}




function init ()
{
if (typeof AudioContext == "function") {
    var audioContext = new AudioContext();
} else if (typeof webkitAudioContext == "function") {
    var audioContext = new webkitAudioContext();
}
// make sure all modification node are already connected, and those paramaters ARE glOBALLY AVAILABLE

source = audioContext.createBufferSource();

gainNode = audioContext.createGain();
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



