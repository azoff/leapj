(function(){

	"use strict";

	requirejs.config({
		paths: {
			jquery: '/js/jquery-2.1.0-custom/jquery.min'
		}
	});

    var myDataRef = new Firebase(config.firebase);
    myDataRef.on('child_added', function(snapshot) {
      // @todo Ignore old commands
      console.log(snapshot.val());
    });
})();
