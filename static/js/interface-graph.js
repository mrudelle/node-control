(function(){

	var app = angular.module('graphInterfaceApp', [ 'remoteControlModule' ])

	app.controller('appController', [ '$scope', '$http', 'MonitorService', function($scope, $http, monitorService){
		
		$scope.monitor = monitorService;

		$scope.monitor.onEvent(function (event)
		{
			console.log(event)

		})

	}]);

})();
