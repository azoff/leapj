(function(){

	"use strict";

	require(['lib/mylib'], withMyLib);

	function withMyLib(myLib) {
		myLib.alert('hi!');
	}


})();