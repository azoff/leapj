define(['firebase'], function(Firebase){

	//NOTE: we use one room for the demo
	var session = new Firebase('https://pr5c1gjakw6.firebaseio-demo.com/session/sf-music-hack-day');
	session.remove(); // clear out all child messages

	function childToMsgConverter(cb) {
		return function(child) {
			cb(child.val());
		};
	}

	return {
		subscribe: function(cb) {
			session.on('child_added', childToMsgConverter(cb));
		}
	};

});