(function(){

	"use strict";

	requirejs.config({
		paths: {
			jquery: '/js/jquery-2.1.0-custom/jquery.min'
		}
	});

    var dataRef = new Firebase(config.firebase_room_uri);
    dataRef.on('child_added', function(snapshot) {
      // @todo Ignore old commands
      console.log(snapshot.val());
    });
})();
