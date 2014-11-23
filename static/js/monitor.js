(function(){
	var app = angular.module('nodeMonitorApp', [])

	app.controller('appController', [ '$scope', '$window', '$http', function($scope, $window, $http){
		
		$scope.msg = "Hello, World"
		$scope.err = null

		$scope.orientation = {
			alpha: 0,
			beta: 0,
			gamma: 0}

		// $scope.sid = $scope.generateSid();
		$scope.sid = null

		$http.get('/getsid').
			success(function(data, status, headers, config) 
			{
				$scope.sid = data;

				if($scope.sid == null)
				{
					$scope.err = 'new sid not readable'
					return;
				}


				// setup connection to listen for server sent event
				var source = new EventSource('/listen/' + $scope.sid);

				source.onerror = function(error)
				{
					console.log(error);
					console.log(error.state);
				}

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
				
			}).
			error(function(data, status, headers, config) 
			{
				$scope.err = 'unable to fetch a new session id, refresh to retry'
			});


	}]);

})();
