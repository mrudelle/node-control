(function(){

	var app = angular.module('mapInterfaceApp', [ 'remoteControlModule' ])

	app.controller('appController', [ '$scope', '$http', '$interval', 'MonitorService', function($scope, $http, $interval, monitorService){
		
		$scope.monitor = monitorService;

		// roughly Lausanne, Switzerland
		$scope.lat = 46.508
		$scope.lon = 6.553

		$scope.delta = 0.1;

		$interval(function() 
		{	
			var beta = adjustOrientation($scope.monitor.orientation.beta)
			var gamma = adjustOrientation($scope.monitor.orientation.gamma)

			$scope.lat -= $scope.delta * Math.abs(beta) * beta /(Math.pow(50,2))
			$scope.lon += $scope.delta * Math.abs(gamma) * gamma /(Math.pow(50,2))
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
