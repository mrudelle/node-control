(function(){

	var app = angular.module('barInterfaceApp', [ 'remoteControlModule' ])

	app.controller('appController', [ '$scope', '$http', 'MonitorService', function($scope, $http, monitorService){
		
		$scope.monitor = monitorService;

	}]);

})();
