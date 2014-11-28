(function()
{
	var app = angular.module('threeInterfaceApp', ['remoteControlModule', '3DdirectiveModule']);

	app.controller('appController', ['$scope', 'MonitorService', function($scope, MonitorService)
	{

		$scope.monitor = MonitorService;

		// we watch for changes in the orientation
		$scope.$watch(
			function(){
				return $scope.monitor.orientation; 
			},
			function(newVal) 
			{
				// update our view
			});

	}]);
})();