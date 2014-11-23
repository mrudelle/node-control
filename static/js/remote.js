(function(){
	var app = angular.module('remoteControlModule', [])

	app.factory("RemoteService", ["$window", "$http", "$rootScope", function($window, $http, $rootScope){

		var remote = {}

		remote.msg = "Hello, World"
		remote.err = null
		remote.sid = null

		remote.orientation = {
			alpha: 0,
			beta: 0,
			gamma: 0}

		remote.oInit = {
			alpha: 0,
			beta: 0,
			gamma: 0,
			init: 1}

		remote.newOrientation = function(event) {
			var diff = 	Math.abs(remote.orientation.beta - Math.trunc(event.beta)) +
			 			Math.abs(remote.orientation.gamma - Math.trunc(event.gamma)) + 
			 			Math.abs(remote.orientation.alpha - Math.trunc(event.alpha))

			remote.orientation.beta = Math.trunc(event.beta)
			remote.orientation.gamma = Math.trunc(event.gamma)
			remote.orientation.alpha = Math.trunc(event.alpha)

			if(!remote.oInit.init == 0) {
				remote.oInit.init = 0
				remote.oInit.beta = remote.orientation.beta
				remote.oInit.gamma = remote.orientation.gamma
				remote.oInit.alpha = remote.orientation.alpha
			}

			// we have to manually update this as event listeners do not trigger angular $apply
			$rootScope.$apply()

			// send that new info to the server
			if (diff > 0 && remote.sid != null)
			{
				$http.post('/control/' + remote.sid, 
				{
					type: 'orientation',
					alpha: remote.dAlpha(),
					beta: remote.dBeta(),
					gamma: remote.dGamma()})

				.success(function(data, status, headers, config) 
				{
					remote.msg = "new orientation posted (" + status + ")"
					remote.err = null
				})
				.error(function(data, status, headers, config) 
				{
					remote.err = status + " : " + data
					remote.msg = null
				});	
			}
		};

		$window.addEventListener("deviceorientation", remote.newOrientation)

		remote.resetOrientation = function() {
			remote.oInit.init = 1
		}

		remote.dAlpha = function() {
			return remote.orientation.alpha - remote.oInit.alpha
		}

		remote.dBeta = function() {
			return remote.orientation.beta - remote.oInit.beta
		}

		remote.dGamma = function() {
			return remote.orientation.gamma - remote.oInit.gamma
		}

		return remote;
	}])

})();
