(function(){

	"use strict";

	requirejs.config({
		paths: {
			jquery: '/js/jquery-2.1.0-custom/jquery.min'
		}
	});

    var myDataRef = new Firebase(config.firebase);
    // @todo Create a tree structure for rooms
    myDataRef.push({name: "joseph", text: "cool"});

})();
