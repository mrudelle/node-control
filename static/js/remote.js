(function(){
	var app = angular.module('nodeControlApp', [])

	app.controller('appController', [ '$scope', '$window', '$http', function($scope, $window, $http){
		
		$scope.msg = "Hello, World"
		$scope.err = null

		$scope.orientation = {}
		$scope.orientation.alpha = 0
		$scope.orientation.beta = 0
		$scope.orientation.gamma = 0

		$scope.oInit = {}
		$scope.oInit.alpha = 0
		$scope.oInit.beta = 0
		$scope.oInit.gamma = 0
		$scope.oInit.init = 1

		$scope.newOrientation = function(event) {
			$scope.orientation.beta = Math.trunc(event.beta)
			$scope.orientation.gamma = Math.trunc(event.gamma)
			$scope.orientation.alpha = Math.trunc(event.alpha)

			if(!$scope.oInit.init == 0) {
				$scope.oInit.init = 0
				$scope.oInit.beta = $scope.orientation.beta
				$scope.oInit.gamma = $scope.orientation.gamma
				$scope.oInit.alpha = $scope.orientation.alpha
			}

			$scope.$apply()

			// send that new info to the server
			$http.post('/someUrl', {msg:'hello word!'}).
			success(function(data, status, headers, config) {
				$scope.msg = "new orientation posted " + status
			}).
			error(function(data, status, headers, config) {
				$scope.err = "Ouch that didn't go well " + status
			});
		};

		$window.addEventListener("deviceorientation", $scope.newOrientation)
	
		$scope.newInit = function() {
			$scope.oInit.init = 1
		}
	}]);

})();
