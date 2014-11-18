(function(){
	var app = angular.module('nodeControlApp', []);

	app.controller('appController', [ '$scope', '$window', function($scope, $window){
		
		$scope.msg = "Hello, World";
		$scope.alpha = 3;
		$scope.beta = 3;
		$scope.gamma = 3;

		$scope.newOrientation = function(event) {
			$scope.beta = Math.trunc(event.beta);
			$scope.gamma = Math.trunc(event.gamma);
			$scope.alpha = Math.trunc(event.alpha);
			$scope.$apply()
		};

		$window.addEventListener("deviceorientation", $scope.newOrientation);
	
	}]);

})();
