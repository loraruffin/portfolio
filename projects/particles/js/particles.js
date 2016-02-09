



			var container, stats, texture;
			var camera, scene, renderer, particles, geometry, materials = [], parameters, i, h, color, size;
			var mouseX = 0, mouseY = 0;
			var image; 

			var canvasWidth = 800;
			var canvasHeight = 400;
			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;

			init();
			animate();
			

  		

			function init(x) {

				//container = document.createElement( 'div' );
				container = document.getElementById( 'canvas' );
				//document.body.appendChild( container );

				camera = new THREE.PerspectiveCamera( 75, canvasWidth / canvasHeight, 1, 300 );
				camera.position.z = 100;

				scene = new THREE.Scene();
				//scene.fog = new THREE.FogExp2( 0x000000, 0.0015 );

				geometry = new THREE.Geometry();


				for ( i = 0; i < 20000; i ++ ) {

					var vertex = new THREE.Vector3();
					vertex.x = Math.random() * 2000 - 1000;
					vertex.y = Math.random() * 2000 - 1000;
					vertex.z = Math.random() * 2000 - 1000;

					geometry.vertices.push( vertex );

				}

				parameters = [
					[ [1, 1, 0.5], 9 ],
					[ [0.95, 1, 0.5], 8 ],
					[ [0.90, 1, 0.5], 7 ],
					[ [0.85, 1, 0.5], 6 ],
					[ [0.80, 1, 0.5], 5 ]
				];
				if(x === 0) {
					texture = THREE.ImageUtils.loadTexture('images/butterfly.png');
				} else	if(x === 1) {
					texture = THREE.ImageUtils.loadTexture('images/heart.png');
				} else if (x === 2){
					texture = THREE.ImageUtils.loadTexture('images/particle.png');
				} else {
					texture = THREE.ImageUtils.loadTexture('images/snowflake.png');
				}
				texture.minFilter = THREE.LinearFilter;
				
				for ( i = 0; i < parameters.length; i ++ ) {

					color = parameters[0][0];
					size  = parameters[i][1];

					materials[i] = new THREE.PointCloudMaterial( { size: size+8, 				
																   map: texture,
																  
																   blending: THREE.AdditiveBlending,
																   depthTest: false,
																   transparent: true
																	} );
																	
															

					particles = new THREE.PointCloud( geometry, materials[i] );

					particles.rotation.x = Math.random() * 6;
					particles.rotation.y = Math.random() * 6;
					particles.rotation.z = Math.random() * 6;

					scene.add( particles );

				}

				renderer = new THREE.WebGLRenderer({canvas: canvas});
				renderer.setPixelRatio( canvasWidth/canvasHeight );
				renderer.setSize( canvasWidth, canvasHeight );


		
}

			canvas.onmousemove = function (ev)
			 {

				mouseX = event.clientX - windowHalfX;
				mouseY = event.clientY - windowHalfY;

			}



		

			//

			function animate() {

				requestAnimationFrame( animate );

				render();
				//stats.update();

			}

			function render() {

				var time = Date.now() * 0.00005;

		

				for ( i = 0; i < scene.children.length; i ++ ) {

					var object = scene.children[ i ];

					if ( object instanceof THREE.PointCloud ) {

						object.rotation.y = time * ( i < 4 ? i + 1 : - ( i + 1 ) );

					}

				}

				for ( i = 0; i < materials.length; i ++ ) {

					color = parameters[i][0];

					h = ( 360 * ( color[0] + time ) % 360 ) / 360;
					materials[i].color.setHSL( h, color[1], color[2] );

				}

				renderer.render( scene, camera );

			}

