var dataRef = new Firebase(config.firebase_room_uri);
dataRef.remove(); // Clear the existing firebase events

dataRef.on('child_added', function(snapshot) {
//    console.log(snapshot.val());
/*
    if (!snapshot.val().type || snapshot.val().type != "ping") {
        // Send a roundtrip ping, to get an upper bound on the time to send to firebase and receive from firebase.
        // (In fact, we measure *TWO* sends and one receive.)
        dataRef.push({type: "ping", createdAt: Firebase.ServerValue.TIMESTAMP, receivedAt: snapshot.val().createdAt});
    } else {
        console.log("Ping time in ms:" + (snapshot.val().createdAt- snapshot.val().receivedAt));
    }
    */
    if (playing) {
        //console.log("playing");
        senderEvent(snapshot.val());
    }
});

var localDataRef = new Faye.Client('http://localhost:8001/');
console.log("hi");
console.log(localDataRef);
localDataRef.subscribe('/events', function(event) {
  console.log(event)
});

// send incoming messages to webaudio control handlers
function senderEvent(o) {
    audioevent[o.type](o)
}
