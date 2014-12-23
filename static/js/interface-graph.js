(function(){

	var app = angular.module('graphInterfaceApp', [ 'remoteControlModule' ])

	app.controller('appController', [ '$scope', '$http', '$window', 'MonitorService', function($scope, $http, $window, monitorService){
		
		$scope.monitor = monitorService;

		$scope.initDate = new Date().getTime();

		$scope.monitor.onEvent(function (event)
		{
			if (event.type == "orientation")
			{
				// TODO: replace with time shipped with information
				myLiveChart.addData([((event.alpha+180)%360), ((event.beta+180)%360), ((event.gamma+180)%360)], new Date().getTime() - $scope.initDate);

				if(myLiveChart.datasets[0].points.length > 20)
					myLiveChart.removeData();
			}
			else
			{
				console.log(event)
			}
		})

		// Instantiate graph

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
