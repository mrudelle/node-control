(function(){

	var app = angular.module('graphInterfaceApp', [ 'remoteControlModule' ])

	app.controller('appController', [ '$scope', '$http', 'MonitorService', function($scope, $http, monitorService){
		
		$scope.monitor = monitorService;

		$scope.monitor.onEvent(function (event)
		{
			if (event.type == "orientation")
			{
				// TODO: replace with time shipped with information
				$scope.chart.series[0].addPoint([new Date().getTime(), event.alpha], true, false);
				$scope.chart.series[1].addPoint([new Date().getTime(), event.beta], true, false);
				$scope.chart.series[2].addPoint([new Date().getTime(), event.gamma], true, false);
			}
			else
			{
				console.log(event)
			}
		})

		// Instantiate graph

		$scope.chart = new Highcharts.Chart({
	        chart: {
	            renderTo: 'chart',
	            type: 'line'
	        },
	        // title: {
	        //     text: 'Fruit Consumption'
	        // },
	        xAxis: {
	            title: {
	            	text: 'Time (ms)'
	            }
	        },
	        yAxis: {
	            title: {
	                text: 'Angle'
	            }
	        },
	        series: 
	        [
		        {
		        	name: 'Alpha',
			        data: []
		    	},
		    	{
		    		name: 'Beta',
			        data: []
		    	},
		    	{
		    		name: 'Gamma',
			        data: []
		    	}
	    	]
	    });

	}]);

})();
