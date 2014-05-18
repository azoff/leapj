var dataRef = new Firebase(config.firebase_room_uri);
dataRef.on('child_added', function(snapshot) {
    console.log(snapshot.val());
    if (playing) {
        console.log("playing");
        senderEvent(snapshot.val());
    }
});

// send incoming messages to webaudio control handlers
function senderEvent(o) {
    switch(o.event.type) {
    case "on":
        audioevent.enable(o)
        break;
    case "off":
        audioevent.disable(o)
        break;
    case "start":
        audioevent.start(o)
        break;
    case "filter":
        audioevent.filter(o)
        break;
    case "volume":
        audioevent.volume(o)
        break;
    case "eq":
        audioevent.eq(o)
        break;
    case "pan":
        audioevent.pan(o)
        break;
    case "reverb":
        audioevent.reverb(o)
        break;
    }
}
