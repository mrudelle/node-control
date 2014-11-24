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


	/*
		allows a input to trigger a function when enter is hit
		directive from http://stackoverflow.com/questions/15417125/submit-form-on-pressing-enter-with-angularjs
	*/ 
	app.directive('ngEnter', function() 
	{
        return function(scope, element, attrs) 
        {
            element.bind("keydown keypress", function(event) 
            {
                if(event.which === 13) 
                {
                    scope.$apply(function()
                    {
                        scope.$eval(attrs.ngEnter, {'event': event});
                    });

                    event.preventDefault();
                }
            });
        };
    });

})();
