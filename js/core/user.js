define(['visuals'], function(visuals){

	"use strict";

	function User(user) {
		user = user || {}
		this.alias = user.alias || 'me';
		this.color = user.color || visuals.randomNeutralRGB();
		this.hexColor = visuals.rgbToHex(this.color);
		this._stems = user._stems || {};
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

	return {
		newTimestamp: function() {
			return new Date().getTime() / 1000;
		},
		session: new User(),
		User: User
	};

});