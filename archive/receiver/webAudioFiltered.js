window.onload = init();

var playing = false;
var source, gainNode, filterNode;





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

function volume(data){
	gainNode.gain.value = data.level;
}

// 3 types of input, 0, 1, or 2
// lowpass, highpass, bandpass

	// value is 0 to 1.0 for Windsor,
		//I scale to 200 Hz - 20,000 Hz
function filter(type, value){

	if(value==0){
	value = 200;
	}
	else{
		value = Math.log(value+1) * 10000;
	}

	// so 0 = 1,

 	
 	switch(type){
 		//lowpass
 		case 0:
 			filterNode.type = filterNode.LOWPASS;
 			break;
 		//highpass
 		case 1:
 			filterNode.type = filterNode.HIGHPASS;
 			break;
 		//bandpass
 		case 2:
 			filterNode.type = filterNode.BANDPASS;
 			break;
 		default:
 			filterNode.type = filterNode.BANDPASS;
 			break;



 	}

	filterNode.frequency.value = value;
	console.log(value + " is new frequency");
}




function init ()
{
	if (typeof AudioContext == "function") {
    	var audioContext = new AudioContext();
	} else if (typeof webkitAudioContext == "function") {
    	var audioContext = new webkitAudioContext();
	}
// make sure all modification node are already connected, and those paramaters ARE glOBALLY AVAILABLE

	//create source of all audio.
	source = audioContext.createBufferSource();


	//gain.
	gainNode = audioContext.createGain();
	source.connect(gainNode);

	filterNode = audioContext.createBiquadFilter();
	gainNode.connect(filterNode);




	filterNode.connect(audioContext.destination);


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



