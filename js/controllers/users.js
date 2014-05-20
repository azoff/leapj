define(['pubsub', 'timing', 'user', 'SayCheese', 'jquery'], function(pubsub, timing, users, SayCheese, $){

	"use strict";

	return function(scope, el) {

		var camera;
		var size = 64;

		publishPic();

		pubsub.subscribe(checkPic);

		function checkPic(msg) {
			if (msg.type !== 'picture') return;
			if (msg.user.alias === users.session.alias) return;
			createUserImage(msg);
		}

		function createUserImage(msg) {
			var data = msg.data;
			var container = getUserContainer(msg.user);
			if (!container) return;
			var img = $(document.createElement('img')).appendTo(container.empty());
			img.src = data;
		}

		function getUserContainer(user) {
			var alias = user.alias;
			var selector = '#' + alias + ' .thumb';
			var node = el.find(selector);
			return node.length ? node : null;
		}

		function publishPic(snapshot) {

			var timeout = 3000;

			if (!camera) {
				var container = getUserContainer(users.session);
				if (!container) return setTimeout(publishPic, timeout);
				camera = new SayCheese(container.selector, { snapshots: true });
				camera.on('snapshot', publishPic);
				camera.on('start', publishPic);
				camera.start();
				return;
			}

			setTimeout(function(){ camera.takeSnapshot(size, size); }, timeout);
			if (snapshot && snapshot.toDataURL)
				pubsub.publish({ type: 'picture', data: snapshot.toDataURL() });

		}

	};

});