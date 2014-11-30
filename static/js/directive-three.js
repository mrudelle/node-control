(function(){
	var app = angular.module('3DdirectiveModule', [])

	app.directive("threeModel", function () {
			return function (scope, elem, attributes) {


				// Set up renderer and camera
				var renderer = new THREE.WebGLRenderer();
				var camera = new THREE.PerspectiveCamera(
					45, // view angle
					1, // ratio : don't care, will be set at render time
					0.1, // near
					10); // far

				// setup the scene
				var scene = new THREE.Scene();
				scene.add(camera);

				camera.position.z = 1.7;

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
					requestAnimationFrame(render);
				});

				attributes.$observe('beta', function(value)
				{
					requestAnimationFrame(render);
				});

				attributes.$observe('gamma', function(value)
				{
					requestAnimationFrame(render);
				});

				function render() 
				{
					if (object)
					{
						rotMat = new THREE.Matrix4();
						rotX = new THREE.Matrix4().makeRotationX(Math.PI*attributes.beta/180);
						rotY = new THREE.Matrix4().makeRotationY(Math.PI*attributes.alpha/180);
						rotZ = new THREE.Matrix4().makeRotationZ(-Math.PI*attributes.gamma/180);

						rotMat.multiplyMatrices( rotY, rotZ );
						rotMat.multiply( rotX );

						object.rotation.setFromRotationMatrix(rotMat);
					}

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
							// scale the model to have a height and width max of 1
							geometry.computeBoundingBox();
							var bBox = geometry.boundingBox;
							var scale = 1/(bBox.max.y-bBox.min.y)
							
							// center the rotation pivot and scale down to one unit high model
							geometry.applyMatrix(
								new THREE.Matrix4().makeTranslation(0, - (bBox.min.y + bBox.max.y)/2, 0))
							geometry.applyMatrix(
								new THREE.Matrix4().makeScale(scale, scale, scale));
							

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