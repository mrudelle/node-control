(function(){

	var app = angular.module('mapInterfaceApp', [ 'remoteControlModule' ])

	app.controller('appController', [ '$scope', '$http', '$interval', 'MonitorService', function($scope, $http, $interval, monitorService){
		
		$scope.monitor = monitorService;

		$scope.lat = 46.508
		$scope.lon = 6.553

		$scope.delta = 0.1;

		$interval(function() {
			
			$scope.lat -= $scope.delta * Math.abs($scope.monitor.orientation.beta) * $scope.monitor.orientation.beta /(Math.pow(50,2))
			$scope.lon += $scope.delta * Math.abs($scope.monitor.orientation.gamma) * $scope.monitor.orientation.gamma /(Math.pow(50,2))
		}, 100);

	}]);

})();
