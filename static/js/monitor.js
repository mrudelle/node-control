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

		// to be lauchned when instruction type is unkown
		monitor.customEventListener = null

		monitor.onCustomEvent = function(func)
		{
			monitor.customEventListener = func;
		}

		// to be launched whenever an instruction is received 
		// (used to override instruction handling)
		monitor.eventListener = null

		monitor.onEvent = function(func)
		{
			monitor.eventListener = func;
		}

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
					}
					else
					{
						if (monitor.customEventListener)
						{
							monitor.customEventListener(msg)
						}
						else
						{
							console.log("uncaught control type received: " + msg.type);
						}
					}

					if (monitor.eventListener)
					{
						monitor.eventListener(msg)
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
