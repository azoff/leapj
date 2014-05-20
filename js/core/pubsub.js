define(['firebase', 'user', 'jquery'], function(Firebase, user, $){

	var ROOM_BASE_URL = 'https://pr5c1gjakw6.firebaseio-demo.com/rooms';

	function childToMsgConverter(cb) {
		return function(child) {
			cb(child.val());
		};
	}

	var session = $.Deferred();

	return {
		startSession: function(name) {
			var room = new Firebase(ROOM_BASE_URL).child(name);
			room.remove(function(){ session.resolve(room); });
		},
		unsubscribe: function(cb) {
			session.done(function(room){
				room.off('child_added', cb);
			});
		},
		subscribe: function(cb) {
			cb = childToMsgConverter(cb);
			session.done(function(room){
				room.on('child_added', cb);
			});
		},
		publish: function(event) {
			event.user = user;
			event.createdAt = Firebase.ServerValue.TIMESTAMP;
			session.done(function(room){
				room.push(event);
			});
		}
	};

});
