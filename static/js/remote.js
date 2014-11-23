(function(){
	var app = angular.module('nodeControlApp', [])

	app.controller('appController', [ '$scope', '$window', '$http', function($scope, $window, $http){
		
		$scope.msg = "Hello, World"
		$scope.err = null
		$scope.sid = null

		$scope.orientation = {
			alpha: 0,
			beta: 0,
			gamma: 0}

		$scope.oInit = {
			alpha: 0,
			beta: 0,
			gamma: 0,
			init: 1}

		$scope.newOrientation = function(event) {
			var diff = 	Math.abs($scope.orientation.beta - Math.trunc(event.beta)) +
			 			Math.abs($scope.orientation.gamma - Math.trunc(event.gamma)) + 
			 			Math.abs($scope.orientation.alpha - Math.trunc(event.alpha))

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
			if (diff > 0 && $scope.sid != null)
			{
				$http.post('/control/' + $scope.sid, 
				{
					type: 'orientation',
					alpha: $scope.dAlpha(),
					beta: $scope.dBeta(),
					gamma: $scope.dGamma()})

				.success(function(data, status, headers, config) 
				{
					$scope.msg = "new orientation posted (" + status + ")"
					$scope.err = null
				})
				.error(function(data, status, headers, config) 
				{
					$scope.err = status + " : " + data
					$scope.msg = null
				});	
			}
		};

		$window.addEventListener("deviceorientation", $scope.newOrientation)
	
		$scope.newInit = function() {
			$scope.oInit.init = 1
		}

		$scope.dAlpha = function() {
			return $scope.orientation.alpha - $scope.oInit.alpha
		}

		$scope.dBeta = function() {
			return $scope.orientation.beta - $scope.oInit.beta
		}

		$scope.dGamma = function() {
			return $scope.orientation.gamma - $scope.oInit.gamma
		}

		$scope.applySid = function()
		{
			$scope.sid = $scope.tempSid.toUpperCase();
		}

		$scope.resetSid = function()
		{
			$scope.sid = null
			$scope.err = null
			$scope.msg = null
			$scope.tempSid = null //to clear the field
		}

	}]);

})();
