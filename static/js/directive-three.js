(function(){
	var app = angular.module('3DdirectiveModule', [])

	app.directive("threeModel", function () {
			return function (scope, elem, attributes) {


				// Set up renderer and camera
				var renderer = new THREE.WebGLRenderer();
				var camera = new THREE.PerspectiveCamera(
					45, // view angle
					1, // don't care, will be set at render time
					0.1, // near
					10); // far

				// setup the scene
				var scene = new THREE.Scene();
				scene.add(camera);

				camera.position.z = 6;
				camera.position.y = 1.5;

				// add three.js canvas to the page
				elem.append(renderer.domElement);

				// our mesh
				var object = null;

				// set the background color
				renderer.setClearColor(0xFFFFFF, 1);

				initCanvas();

				// fit the element to the windowd
				window.addEventListener('resize', initCanvas);

				function initCanvas() 
				{
					var WIDTH = window.innerWidth,
					HEIGHT = window.innerHeight;
					renderer.setSize(WIDTH, HEIGHT);
					camera.aspect = WIDTH / HEIGHT;
					camera.updateProjectionMatrix();
					render();
				}

				attributes.$observe('threeModel', function(value)
				{
					loadModel(value);
				});

				attributes.$observe('alpha', function(value)
				{
					if(object)
					{
						object.rotation.y = Math.PI*value/180;
						render()
					}
				});

				attributes.$observe('beta', function(value)
				{
					if(object)
					{
						object.rotation.x = Math.PI*value/180
						render()
					}
				});

				attributes.$observe('gamma', function(value)
				{
					if(object)
					{
						object.rotation.z = -Math.PI*value/180
						render()
					}
				});

				function render() 
				{
					// draw it !
					renderer.render(scene, camera);
				}

				// load a new model in our view
				function loadModel(path) 
				{
					new THREE.JSONLoader().load(
						path, 
						function(geometry) 
						{ 
							// the normal material gives a pretty nice effect
							var objectMaterial = new THREE.MeshNormalMaterial(); 
							
							var mesh = new THREE.Mesh( geometry, objectMaterial ); 

							scene.add(mesh);
							render();
							object = mesh;
						}); 
				}
			}
		}
	)

})();