define(['visuals'], function(visuals){

	"use strict";

	function User() {
		this.color = visuals.randomNeutralRGB();
		this.hexColor = visuals.rgbToHex(this.color);
	}

	User.prototype.stems = function() {
		if (this._stems) return this._stems;
		return this._stems = {};
	};

	User.prototype.controlsStems = function() {
		return Object.keys(this.stems()).length > 0;
	};

	User.prototype.isControllingStem = function(stem) {
		return stem.key in this.stems();
	};

	User.prototype.toggleStemControl = function(stem) {
		if (stem.key in this.stems()) {
			delete this.stems()[stem.key];
			return false;
		} else {
			this.stems()[stem.key] = true;
			return true;
		}
	};

	return new User();

});