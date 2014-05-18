require(["app"],function(app){
    var dataRef = new Firebase(config.firebase_room_uri);
    dataRef.on('child_added', function(snapshot) {
        //parseMsg(snapshot.val())
    });

    // send incoming messages to webaudio control handlers
    function parseMsg(o) {
        switch(o.type) {
        case "on":
            app.enable(o)
            break;
        case "off":
            app.disable(o)
            break;
        case "start":
            app.start(o)
            break;
        case "filter":
            app.filter(o)
            break;
        case "volume":
            app.volume(o)
            break;
        case "eq":
            app.eq(o)
            break;
        case "pan":
            app.pan(o)
            break;
        case "reverb":
            app.reverb(o)
            break;
        }
    }
})
