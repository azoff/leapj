(function(){

	"use strict";

	requirejs.config({
		paths: {
			jquery: '/js/jquery-2.1.0-custom/jquery.min'
		}
	});

    var dataRef = new Firebase(config.firebase_room_uri);
    // @todo Create a tree structure for rooms
//    dataRef.push({name: "joseph", text: "cool", createdAt: Firebase.ServerValue.TIMESTAMP});

})();
