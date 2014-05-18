// Generated by CoffeeScript 1.7.1
var LeapToFirebase, module;

LeapToFirebase = (function() {
  function LeapToFirebase(firebase_room_uri) {
    console.log("Construct LeapToFirebase. Connecting to " + firebase_room_uri);
    this.firebase_room_uri = firebase_room_uri;
    this.firebase = new Firebase(this.firebase_room_uri);
  }

  LeapToFirebase.prototype.translate = function(leap_event) {
    if (leap_event.type === 'pinch-start') {
      return {
        user: 'string',
        stem: leap_event.value,
        event: {
          type: 'volume',
          level: 0
        },
        source: 'leap'
      };
    } else if (leap_event.type === 'pinch-stop') {
      return {
        user: 'string',
        stem: leap_event.value,
        event: {
          type: 'volume',
          level: 1
        },
        source: 'leap'
      };
    } else {
      return null;
    }
  };

  LeapToFirebase.prototype.sendToFirebase = function(event) {
    console.log("Sending event " + (JSON.stringify(event)) + " to firebase " + this.firebase_room_uri);
    return this.firebase.push(event);
  };

  return LeapToFirebase;

})();

module = module || {};

module.exports = {
  LeapToFirebase: LeapToFirebase
};
