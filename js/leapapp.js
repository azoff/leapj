(function(){

	"use strict";

	requirejs.config({
		paths: {
			jquery: '/js/jquery-2.1.0-custom/jquery.min'
		}
	});

    // @todo Change the server to the dev server, not the open test server
    var myDataRef = new Firebase('https://pr5c1gjakw6.firebaseio-demo.com/');
    // @todo Create a tree structure for rooms
    myDataRef.push({name: "joseph", text: "cool"});

})();
