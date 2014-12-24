(function(){

	var app = angular.module('mapInterfaceApp', [ 'remoteControlModule' ])

	app.controller('appController', [ '$scope', '$http', '$interval', 'MonitorService', function($scope, $http, $interval, monitorService){
		
		$scope.monitor = monitorService;

		// roughly Lausanne, Switzerland
		$scope.lat = 46.508
		$scope.lon = 6.553
		$scope.zoom = 10

		// used to monitor burst in anle changes
		var zoomState = 0

		// defines the shape of the move curve
		var moveCurveShape = 2.5

		$scope.delta = 102.4;

		$interval(function() 
		{	
			var beta = adjustOrientation($scope.monitor.orientation.beta)
			var gamma = adjustOrientation($scope.monitor.orientation.gamma)
			var alpha = adjustOrientation($scope.monitor.orientation.alpha)

			// update position
			// pixel_coord = map_coord * 2^zoom_level
			$scope.lat -= $scope.delta * Math.sign(beta) * Math.pow(Math.abs(beta),moveCurveShape) / (Math.pow(50,moveCurveShape)) / Math.pow(2, $scope.zoom) 
			$scope.lon += $scope.delta * Math.sign(gamma) * Math.pow(Math.abs(gamma),moveCurveShape) / (Math.pow(50,moveCurveShape)) / Math.pow(2, $scope.zoom)

		}, 100);

		$scope.monitor.onCustomEvent(function (event)
		{
			if (event.type == "geolocation")
			{
				console.log("new geolocation " + event.latitude + " " + event.longitude)
				$scope.lat = event.latitude
				$scope.lon = event.longitude
			}
			else
			{
				console.log("uncaugth " + event.type + " instruction")
			}
		})

		$scope.monitor.onEvent(function(event)
		{
			if (event.type == "orientation")
			{
				newValueinSignal(adjustOrientation(event.alpha), event.time)
				detectPeak(function()
				{
					if($scope.zoom < 30) 
						$scope.zoom ++
				}
				, function() 
				{
					if($scope.zoom > 1) 
						$scope.zoom --
				})
			}
		})

		// change an angle from any range (eg. [0, 360]) to [-180, 180]
		function adjustOrientation(angle)
		{
			return ((angle + 180*3) % 360) - 180
		}

		/*  Signal Processing Code for peak detection  */

		var valBuffer = [];
		var timeBuffer = [];
		var filterInterpolation = 20; // in ms (signal is 50ms)
		var filterWidth = 700; // in ms
		var filterHeight = 25; // in degrees 
		var filterLength = Math.floor(filterWidth/filterInterpolation);
		var memoryLength = 2000; // in ms (must be at greater than filterWidth plus signalfrequence*2)

		/* fills the memory buffer */
		function newValueinSignal(val, time)
		{
			valBuffer.push(val);
			timeBuffer.push(time);

			// only keep memoryLength miliseconds of value
			while (timeBuffer[timeBuffer.length-1] - timeBuffer[0] > memoryLength)
			{
				valBuffer.shift();
				timeBuffer.shift();
			}
		}

		/* Detects if a peak exists in the memory buffer
		 */
		function detectPeak(upCallback, downCallback)
		{
			var inter = interpolate(valBuffer, timeBuffer, 20)

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
						upCallback()
						valBuffer = []
						timeBuffer = []
						break
					}
					else if (sum/filterLength - filterHeight > inter[i])
					{
						downCallback()
						valBuffer = []
						timeBuffer = []
						break
					}

					sum -= inter[i-filterDiam]
					sum += inter[i+filterDiam]
				}
			}
		}

		/*  Interpolates the first array 
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

	}]);

})();
