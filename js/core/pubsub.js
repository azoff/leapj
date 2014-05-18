define(['firebase', 'scope/tracks', 'fingerprint'], function(Firebase, tracks, Fingerprint){

	//NOTE: we use one room for the demo
	var fingerprint = (new Fingerprint).get();
	var session = new Firebase('https://pr5c1gjakw6.firebaseio-demo.com/rooms').child(tracks.room);
	session.remove(); // clear out all child messages

	function childToMsgConverter(cb) {
		return function(child) {
			cb(child.val());
		};
	}

	return {
		subscribe: function(cb) {
			session.on('child_added', childToMsgConverter(cb));
		},
		publish: function(event) {
			event.createdAt = Firebase.ServerValue.TIMESTAMP;
			event.fingerprint = fingerprint;
			session.push(event);
		}
	};

});
