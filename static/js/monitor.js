(function(){
	var app = angular.module('remoteControlModule', [])

	/*
		this service defines a monitor objects that first fetch a SID (available at monitor.sid)
		then it connects to the server and listen for changes in orientation
		changes on monitor.orientation are "live" as message events trigger a $rootscope.$apply
	*/

	app.factory("MonitorService", ["$http", "$rootScope", function($http, $rootScope) {
		
		var monitor = {}

		monitor.orientation = {
			alpha: 0,
			beta: 0,
			gamma: 0}

		monitor.sid = null

		$http.get('/getsid').
			success(function(data, status, headers, config) 
			{
				monitor.sid = data;

				if(monitor.sid == null)
				{
					monitor.err = 'new sid not readable'
					return;
				}


				// setup connection to listen for server sent event
				var source = new EventSource('/listen/' + monitor.sid);

				source.onerror = function(error)
				{
					console.log(error);
					console.log(error.state);
				}

				source.addEventListener('message', function(event) {
					
					var msg = JSON.parse(event.data)

					if(msg.type && msg.type == 'orientation')
					{
						monitor.orientation = {
							alpha: msg.alpha,
							beta: msg.beta,
							gamma: msg.gamma
						}

						monitor.msg = "New orientation received";
						console.log(monitor.orientation)
					}
					else
					{
						console.log("unknown control type received: " + msg.type);
					}

					$rootScope.$apply();
				});
				
			}).
			error(function(data, status, headers, config) 
			{
				monitor.err = 'unable to fetch a new session id, refresh to retry'
			});

		return monitor;

	}]);

})();
