(function(){
	var app = angular.module('remoteControlModule', [])

	/*
		this service defines a remote object that will constantly monitor the orientation and 
		send it to the server to the session SID only if this value is set
		the orientation served "live" at this.orientation and changes trigger $rootScope.$apply already
	*/

	app.factory("RemoteService", ["$window", "$http", "$rootScope", function($window, $http, $rootScope){

		var remote = {}

		remote.msg = "Hello, World"
		remote.err = null
		remote.sid = null

		// geoloc
		remote.geolocPending = false

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

			// we perform orientation initialisation when init = 1
			if(remote.oInit.init != 0) {
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
				remote.submitControl({
					type: 'orientation',
					alpha: remote.dAlpha(),
					beta: remote.dBeta(),
					gamma: remote.dGamma()});
			}
		};

		remote.newGeolocation = function() 
		{
			if (navigator.geolocation)
			{
				remote.geolocPending = true
				navigator.geolocation.getCurrentPosition( function(postion)
				{
					remote.submitControl({
						type: "geolocation",
						latitude: postion.coords.latitude,
						longitude: postion.coords.longitude
					})
					remote.geolocPending = false
				}, function (error)
				{
					remote.err = "Geolocation error : " + error.code;
					remote.geolocPending = false

					// error.code can be:
				    //   0: unknown error
				    //   1: permission denied
				    //   2: position unavailable (error response from locaton provider)
				    //   3: timed out
				});
			}
			else
			{
				remote.err = "Your navigator do not support geolocation"
			}
		}

		$window.addEventListener("deviceorientation", remote.newOrientation)

		remote.resetOrientation = function() 
		{
			remote.oInit.init = 1
		}

		remote.dAlpha = function() 
		{
			return degreeDelta(remote.orientation.alpha, remote.oInit.alpha)
		}

		remote.dBeta = function() 
		{
			return degreeDelta(remote.orientation.beta, remote.oInit.beta)
		}

		remote.dGamma = function() 
		{
			return degreeDelta(remote.orientation.gamma, remote.oInit.gamma)
		}

		function degreeDelta(angle, init)
		{
			//we don't want negative degrees
			return (360 + angle - init) % 360
		}

		// sends a dictionary (payload) of instruction to the server
		// to be redirected to the monitor
		remote.submitControl = function(payload) 
		{
			//append current time
			payload.time = new Date().getTime()

			$http.post('/control/' + remote.sid, payload)
			.success(function(data, status, headers, config) 
			{
				remote.msg = "new " + payload.type + "instruction sent (" + status + ")"
				remote.err = null
			})
			.error(function(data, status, headers, config) 
			{
				remote.err = status + " : " + data
				remote.msg = null
			});
		}

		return remote;
	}])

})();
