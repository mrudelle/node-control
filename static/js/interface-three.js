(function()
{
	var app = angular.module('threeInterfaceApp', ['remoteControlModule', '3DdirectiveModule']);

	app.controller('appController', ['$scope', 'MonitorService', function($scope, MonitorService)
	{
		$scope.models = 
		[
			"/static/obj/bunny.js",
			"/static/obj/teapot.js",
			"/static/obj/dragon.js",
			"/static/obj/suzanne.js"
		]

		// first is the model at index 0
		$scope.model = 0;

		$scope.monitor = MonitorService;

		$scope.changeModel = function()
		{
			$scope.model = ($scope.model + 1) % $scope.models.length;
		}

	}]);
})();