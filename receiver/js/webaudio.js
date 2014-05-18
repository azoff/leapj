window.onload = init();

var playing = false;
var stems = [];     // Will contain .source and .gainNode
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
    // make sure all modification node are already connected, and those paramaters ARE glOBALLY AVAILABLE


    var playButton = document.getElementById("play");
    playButton.onclick = playPause;

    bufferLoader = new BufferLoader(
        audioContext,
        [
        "/audio//Queen - We Will Rock You/drums.ogg",
        "/audio//Queen - We Will Rock You/guitar.ogg",
        "/audio//Queen - We Will Rock You/rhythm.ogg",
        "/audio//Queen - We Will Rock You/song.ogg",
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
        stems[i].source = audioContext.createBufferSource();
        stems[i].source.buffer = bufferList[i];
        stems[i].source.connect(audioContext.destination);

        stems[i].gainNode = audioContext.createGain();
        stems[i].source.connect(stems[i].gainNode);
        stems[i].gainNode.connect(audioContext.destination);
    }
    for (var i = 0; i < stems.length; i++) { 
//        stems[i].source.start(0);
    }
}
