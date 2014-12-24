(function(){

	var app = angular.module('graphInterfaceApp', [ 'remoteControlModule' ])

	app.controller('appController', [ '$scope', '$http', '$window', 'MonitorService', function($scope, $http, $window, monitorService){
		
		$scope.monitor = monitorService;

		var initDate = new Date().getTime();

		// will the last values of alpha
		var alphaBuffer = [];
		var timeBuffer = [];

		// variables for signal
		var filterInterpolation = 20; // in ms (signal is 50ms)
		var filterWidth = 1000; // in ms
		var filterHeight = 35; // in degrees 
		var filterLength = Math.floor(filterWidth/filterInterpolation);

		$scope.monitor.onEvent(function (event)
		{
			if (event.type == "orientation")
			{
				// TODO: replace with time shipped with information
				myLiveChart.addData([((event.alpha+180)%360), ((event.beta+180)%360), ((event.gamma+180)%360)], event.time - initDate);

				// only keep 20 values
				if(myLiveChart.datasets[0].points.length > 20)
					myLiveChart.removeData();

				alphaBuffer.push((event.alpha+180)%360);
				timeBuffer.push(event.time);

				// only keep 2 seconds of value
				while (timeBuffer[timeBuffer.length-1] - timeBuffer[0] > 2000)
				{
					alphaBuffer.shift();
					timeBuffer.shift();
				}

				/* detect peaks */
				var inter = interpolate(alphaBuffer, timeBuffer, 20)

				if (inter.length > filterLength)
				{
					var filterDiam = Math.floor(filterLength/2)

					/* do a simple sum on the filterlenght first elements */
					var sum = inter.slice(0, filterLength).reduce(function(prev, curr){return prev+curr}, 0);

					for (var i = filterDiam ; i < inter.length-filterDiam-1; i++)
					{
						// actual peak detection
						if (sum/filterLength + filterHeight < inter[i])
						{
							console.log("up peak")
							alphaBuffer = []
							timeBuffer = []
							break
						}
						else if (sum/filterLength - filterHeight > inter[i])
						{
							console.log("down peak");
							alphaBuffer = []
							timeBuffer = []
							break
						}

						sum -= inter[i-filterDiam]
						sum += inter[i+filterDiam]
					}
				}

			}
			else
			{
				console.log(event)
			}
		})


		/*
		 *	interpolates the first array 
		 *	according to times in the second array
		 *	with gaps defined by "intersice"  
		 */
		function interpolate(values, time, intersice)
		{
			ret = [];
			valIndex = 0;
			for (var i = time[0]; i < time[time.length-1]; i+=intersice)
			{
				while (time[valIndex] < i)
				{
					valIndex ++
				}

				if (i == time[valIndex])
				{
					ret.push(values[valIndex])
				}
				else
				{
					ratio = (time[valIndex]-i) / (time[valIndex] - time[valIndex-1])
					ret.push(values[valIndex-1] * (ratio) + values[valIndex] * (1-ratio))
				}
			}
			return ret
		}

		/* Instantiate graph */

		var canvas = $window.document.getElementById('chart');
		var ctx = canvas.getContext('2d');
		var startingData = {
		      labels: [1,2],
		      datasets: [
		          {
		          	  label: "Alpha",
		              fillColor: "rgba(205,151,187,0.2)",
		              strokeColor: "rgba(205,151,187,1)",
		              pointColor: "rgba(205,151,187,1)",
		              pointStrokeColor: "#fff",
		              data: [1,2]
		          },
		          {
		          	  label: "Beta",
		              fillColor: "rgba(151,187,205,0.2)",
		              strokeColor: "rgba(151,187,205,1)",
		              pointColor: "rgba(151,187,205,1)",
		              pointStrokeColor: "#fff",
		              data: [1,2]
		          },
		          {
		          	  label: "Gamma",
		              fillColor: "rgba(151,205,187,0.2)",
		              strokeColor: "rgba(151,205,187,1)",
		              pointColor: "rgba(151,205,187,1)",
		              pointStrokeColor: "#fff",
		              data: [1,2]
		          }
		      ]
		    };

		var win = angular.element($window); 

		var canvasResize = function(){
		    var w = $window.innerWidth;
		    var h = $window.innerHeight;

		    canvas.width = w;
		    canvas.style.width = w;
		    canvas.height = h; 
		    canvas.style.height = h;
		}
		win.bind("resize", canvasResize);
		canvasResize();

		// Reduce the animation steps for demo clarity.
		var myLiveChart = new Chart(ctx).Line(startingData, 
			{
				responsive: true,
				animation: false,
				animationSteps: 2,
				bezierCurve: false,
				maintainAspectRatio: false,
				showTooltips: false,
				showScale: true,
			});

	}]);

})();
