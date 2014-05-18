var dataRef = new Firebase(config.firebase_room_uri);
dataRef.remove(); // Clear the existing firebase events

dataRef.on('child_added', function(snapshot) {
    //console.log(snapshot.val());
    if (playing) {
        //console.log("playing");
        senderEvent(snapshot.val());
    }
});

// send incoming messages to webaudio control handlers
function senderEvent(o) {
    if (gestures.hasOwnProperty(o.type)) {
        gestures[o.type](o.value)
    }
}
