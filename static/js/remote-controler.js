(function(){

	var app = angular.module('remoteApp', ['remoteControlModule'])

	app.controller('appController', [ '$scope', '$window', '$http', 'RemoteService', function($scope, $window, $http, remoteService){
		
		$scope.remote = remoteService

		// focus on the Session id when we first arrive
		document.getElementById("sid-field").focus();

		$scope.applySid = function()
		{
			$scope.remote.sid = $scope.tempSid.toUpperCase();
		}

		$scope.resetSid = function()
		{
			$scope.remote.sid = null
			$scope.remote.err = null
			$scope.remote.msg = null
		}

		$scope.resetSidField = function()
		{
			$scope.tempSid = null
			document.getElementById("sid-field").focus();
		}

	}]);

})();
