if (!config.localPubSub) {
    var dataRef = new Firebase(config.firebase_room_uri);
    dataRef.remove(); // Clear the existing firebase events

    dataRef.on('child_added', function(snapshot) { runEvent(snapshot.val()); });
} else {
    var localDataRef = new Faye.Client(config.localPubSub);
    localDataRef.subscribe('/events', function(event) { runEvent(event.event); });
}

function runEvent(o) {
//    console.log(o);
/*
    if (!o.type || o.type != "ping") {
        // Send a roundtrip ping, to get an upper bound on the time to send to firebase and receive from firebase.
        // (In fact, we measure *TWO* sends and one receive.)
        dataRef.push({type: "ping", createdAt: Firebase.ServerValue.TIMESTAMP, receivedAt: o.createdAt});
    } else {
        console.log("Ping time in ms:" + (o.createdAt- o.receivedAt));
    }
    */
    if (playing) {
        //console.log("playing");
        senderEvent(o);
    }
}

// send incoming messages to webaudio control handlers
function senderEvent(o) {
    audioevent[o.type](o)
}
