(function(){

	var app = angular.module('mapInterfaceApp', [ 'remoteControlModule' ])

	app.controller('appController', [ '$scope', '$http', '$interval', 'MonitorService', function($scope, $http, $interval, monitorService){
		
		$scope.monitor = monitorService;

		// roughly Lausanne, Switzerland
		$scope.lat = 46.508
		$scope.lon = 6.553
		$scope.zoom = 10

		// used to monitor burst in anle changes
		var zoomState = 0

		$scope.delta = 0.1;

		$interval(function() 
		{	
			var beta = adjustOrientation($scope.monitor.orientation.beta)
			var gamma = adjustOrientation($scope.monitor.orientation.gamma)
			var alpha = adjustOrientation($scope.monitor.orientation.alpha)

			// update position only when directed trough the screen
			if(alpha < 25 && alpha > -25)
			{	
				$scope.lat -= $scope.delta * Math.sign(beta) * Math.pow(Math.abs(beta),2.5) /(Math.pow(50,2.5))
				$scope.lon += $scope.delta * Math.sign(gamma) * Math.pow(Math.abs(gamma),2.5) /(Math.pow(50,2.5))
			}

			// weird stuff to get an incremential zoom
			if (alpha > 30)
			{
				if(zoomState != 1 && $scope.zoom < 30) 
					$scope.zoom ++
				zoomState = 1
			}
			else if (alpha < -30)
			{
				if(zoomState != -1 && $scope.zoom > 1) 
					$scope.zoom --
				zoomState = -1
			}
			else if ( alpha < 20 && alpha > -20)
			{
				zoomState = 0
			}

		}, 100);

		$scope.monitor.onCustomEvent(function (event)
		{
			if (event.type == "geolocation")
			{
				console.log("new geoloc " + event.latitude + " " + event.longitude)
				$scope.lat = event.latitude
				$scope.lon = event.longitude
			}
			else
			{
				console.log("uncaugth " + event.type + " instruction")
			}
		})

		// change an angle from any range (eg. [0, 360]) to [-180, 180]
		function adjustOrientation(angle)
		{
			return ((angle + 180*3) % 360) - 180
		}

	}]);

})();
