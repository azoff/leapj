define(['visuals'], function(visuals){

	function User() {
		this.color = visuals.randomNeutralRGB();
	}

	return new User();

});