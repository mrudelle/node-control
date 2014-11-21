(function(){
	var app = angular.module('nodeMonitorApp', [])

	app.controller('appController', [ '$scope', '$window', '$http', function($scope, $window, $http){
		
		$scope.msg = "Hello, World"
		$scope.err = null

		$scope.orientation = {
			alpha: 0,
			beta: 0,
			gamma: 0}

		// listen for server sent event
		var source = new EventSource('/listen/AAAAAA');

		source.addEventListener('message', function(event) {
			
			var msg = JSON.parse(event.data)

			if(msg.type && msg.type == 'orientation')
			{
				$scope.orientation = {
					alpha: msg.alpha,
					beta: msg.beta,
					gamma: msg.gamma
				}

				$scope.msg = "New orientation received";
			}
			else
			{
				console.log("unknown control type received: " + msg.type);
			}

			$scope.$apply();
		});

		source.addEventListener('error', function(e) {
			console.log(e);
		}, false);

	}]);

})();
