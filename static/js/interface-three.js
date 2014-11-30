(function()
{
	var app = angular.module('threeInterfaceApp', ['remoteControlModule', '3DdirectiveModule']);

	app.controller('appController', ['$scope', 'MonitorService', function($scope, MonitorService)
	{

		$scope.monitor = MonitorService;

	}]);
})();