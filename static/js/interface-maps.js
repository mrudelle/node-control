(function(){

	var app = angular.module('mapInterfaceApp', [ 'remoteControlModule' ])

	app.controller('appController', [ '$scope', '$http', 'MonitorService', function($scope, $http, monitorService){
		
		$scope.monitor = monitorService;

	}]);

})();
