
            var camera         = undefined, 
                scene          = undefined, 
                renderer       = undefined, 
                light          = undefined,
                mouseX         = undefined, 
                mouseY         = undefined,
                
                maze           = undefined, 
                mazeMesh       = undefined,
                mazeDimension  = 15,
                planeMesh      = undefined,
                mouseMesh      = undefined,
                ballMesh       = [],
                ballPosition   = [[2,4],[9,3]],
                cheeseMesh     = [],
                cheesePosition = [[1,12],[2,1],[6,1],[4,4],[6,7],[5,13],[6,4],[7,13],[8,5],[9,11],[9,13],[10,1],[10,9],[12,1]],
                monsterMesh    = [],
                monsterPosition= [[4,3],[4,8],[4,5],[10,2],[12,4]]              
                cheeseCount    = 0;
                destroy_list   = [],
                ballRadius     = 0.25,
                keyAxis        = [0, 0],
                legFR          = undefined,
                legFL          = undefined,
                legBR          = undefined,
                legBL          = undefined,
                gameState      = undefined,
                counter        = 1,
                w              = 0,
                monMove        = 0,
                dir            = 1,
                time           = 0,
                
                
            //Textures
                planeTexture   		= THREE.ImageUtils.loadTexture('images/concrete.png'),
                brickTexture   		= THREE.ImageUtils.loadTexture('images/brick.png'),
                pineappleTexture   	= THREE.ImageUtils.loadTexture('images/pineapple.png'),
                cheeseTexture   	= THREE.ImageUtils.loadTexture('images/cheese.jpg'),


            // Box2D shortcuts
                b2World        = Box2D.Dynamics.b2World,
                b2FixtureDef   = Box2D.Dynamics.b2FixtureDef,
                b2BodyDef      = Box2D.Dynamics.b2BodyDef,
                b2Body		   = Box2D.Dynamics.b2Body,
                b2CircleShape  = Box2D.Collision.Shapes.b2CircleShape,
                b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
                b2Settings     = Box2D.Common.b2Settings,
                b2Vec2         = Box2D.Common.Math.b2Vec2,

            // Box2D world variables 
                wWorld         = undefined,
                wMouse         = undefined;
                wBall          = [];
                wCheese        = undefined;
                wMonster       = [];
            
            //Particles    
            	particles      = undefined,
            	geometry	   = undefined,
            	materials 	   = [],
            	parameters	   = undefined,
            	color		   = undefined,
            	size		   = undefined,
            	first 		   = 0;
            
            //Sounds
            	var soundSpace         = new buzz.sound('../sounds/space.wav' );
           		var soundBang          = new buzz.sound('../sounds/hit.wav' );     
            	var soundCollect       = new buzz.sound('../sounds/collect.wav' );
            	var soundEnd       	   = new buzz.sound('../sounds/end.wav' );

            

            
            function createPhysicsWorld() {
            
                // Create the world object.
                wWorld = new b2World(new b2Vec2(0, 0), true);

                // Create mouse
                var bodyDef = new b2BodyDef();
                bodyDef.type = b2Body.b2_dynamicBody;
                bodyDef.position.Set(1, 1);
                wMouse = wWorld.CreateBody(bodyDef);
                var fixDef = new b2FixtureDef();
                fixDef.density = 1.0;
                fixDef.friction = 0.0;
                fixDef.restitution = 0.25;
                fixDef.shape = new b2CircleShape(ballRadius+ 0.14);
                wMouse.CreateFixture(fixDef);
                wMouse.SetUserData("mouse");
               
                // Create the ball
                var bodyDef = new b2BodyDef();
                bodyDef.type = b2Body.b2_dynamicBody;
                var fixDef = new b2FixtureDef();
                fixDef.density = 1.0;
                fixDef.friction = 0.0;
                fixDef.restitution = 0.25;
                fixDef.shape = new b2CircleShape(ballRadius);
			   	for (var i = 0; i < ballPosition.length; i++) {
					bodyDef.position.x = ballPosition[i][0];
					bodyDef.position.y = ballPosition[i][1];
					wBall[i] = wWorld.CreateBody(bodyDef);           
					wBall[i].CreateFixture(fixDef);                            
					wBall[i].SetUserData("ball");
				}

                
                //Create cheese
                var bodyDef = new b2BodyDef();
                bodyDef.type = b2Body.b2_staticBody;
                var fixDef = new b2FixtureDef();
                fixDef.density = 1.0;
                fixDef.friction = 0.0;
                fixDef.restitution = 0.25;
                fixDef.shape = new b2CircleShape(ballRadius);
                for (var i = 0; i < cheesePosition.length; i++) {
                            bodyDef.position.x = cheesePosition[i][0];
                            bodyDef.position.y = cheesePosition[i][1];
                            wCheese = wWorld.CreateBody(bodyDef);           
                			wCheese.CreateFixture(fixDef);                            
                            wCheese.SetUserData("cheese");
                    }
                    
            	//Create monsters
                var bodyDef = new b2BodyDef();
                bodyDef.type = b2Body.b2_staticBody;              
                var fixDef = new b2FixtureDef();
                fixDef.density = 0.1;
                fixDef.friction = 0.0;
                fixDef.restitution = 0.25;
                fixDef.shape = new b2CircleShape(ballRadius);
                for (var i = 0; i < monsterPosition.length; i++) {
                            bodyDef.position.x = monsterPosition[i][0];
                            bodyDef.position.y = monsterPosition[i][1];
                            wMonster[i] = wWorld.CreateBody(bodyDef);           
                			wMonster[i].CreateFixture(fixDef);                            
                            wMonster[i].SetUserData("monster");
                }
                
                // Create the maze.
                var bodyDef = new b2BodyDef();
                bodyDef.type = b2Body.b2_staticBody;
                var fixDef = new b2FixtureDef();
                fixDef.shape = new b2PolygonShape();
                fixDef.shape.SetAsBox(0.5, 0.5);
                for (var i = 0; i < maze.dimension; i++) {
                    for (var j = 0; j < maze.dimension; j++) {
                        if (maze[j][i]) {
                            bodyDef.position.x = i;
                            bodyDef.position.y = j;
                            wWorld.CreateBody(bodyDef).CreateFixture(fixDef);
                        }
                    }
                }

                
                
                // Add listeners for contact
				var listener = new Box2D.Dynamics.b2ContactListener;
 
				listener.BeginContact = function(contact) {
					//Mouse + Cheese
    				if (contact.GetFixtureA().GetBody().GetUserData() == 'mouse' && contact.GetFixtureB().GetBody().GetUserData() == 'cheese'){
  			            	var i =  Math.floor(contact.GetFixtureB().GetBody().GetPosition().x);
                        	var j =  Math.floor(contact.GetFixtureB().GetBody().GetPosition().y);
                        	//return index of a nested array
                        	var a = index(cheesePosition,i,j)
 							scene.remove(cheeseMesh[a]);
 							destroy_list.push(contact.GetFixtureB().GetBody());
 							cheeseCount++;
 							soundCollect.play();
         	   		}      	   	
         	   		//Mouse + Monster
         	   		if (contact.GetFixtureA().GetBody().GetUserData() == 'mouse' && contact.GetFixtureB().GetBody().GetUserData() == 'monster'){
                        	time = 150;
                        	gameState = 'fade out';
                        	scene.remove(mouseMesh);
                        	soundSpace.play();
 					}
 					//Monster + Mouse
 					if (contact.GetFixtureA().GetBody().GetUserData() == 'monster' && contact.GetFixtureB().GetBody().GetUserData() == 'mouse'){
                        	time = 150;
                        	gameState = 'fade out';
                        	scene.remove(mouseMesh);
                        	soundSpace.play();
 					}
 					//Ball + Monster
 					if (contact.GetFixtureA().GetBody().GetUserData() == 'ball' && contact.GetFixtureB().GetBody().GetUserData() == 'monster'){
  			            	var i =  Math.floor(contact.GetFixtureB().GetBody().GetPosition().x);
                        	var j =  Math.floor(contact.GetFixtureB().GetBody().GetPosition().y);
                        	//return index of a nested array
                        	var a = index(monsterPosition,-1,j)
                			soundBang.play();
 							scene.remove(monsterMesh[a]);
 							destroy_list.push(contact.GetFixtureB().GetBody());
                	}
                	 //Monster + Ball
                	 if (contact.GetFixtureA().GetBody().GetUserData() == 'monster' && contact.GetFixtureB().GetBody().GetUserData() == 'ball'){
  			            	var i =  Math.floor(contact.GetFixtureA().GetBody().GetPosition().x);
                        	var j =  Math.floor(contact.GetFixtureA().GetBody().GetPosition().y);
                        	//return index of a nested array
                        	var a = index(monsterPosition,-1,j)
                			soundBang.play();
 							scene.remove(monsterMesh[a]);
 							destroy_list.push(contact.GetFixtureA().GetBody());
                	}
                	
         	   		    	   	
         	   	}
         	   	
				// set contact listener to the world
				wWorld.SetContactListener(listener);


            }
            
    
            function generate_maze_mesh(field) {
                var temp = new THREE.Geometry();
                for (var i = 0; i < field.dimension; i++) {
                    for (var j = 0; j < field.dimension; j++) {
                        if (field[j][i]) {
                            var geometry = new THREE.BoxGeometry(1,1,0.3,1,1,1);
                            var mesh_ij = new THREE.Mesh(geometry);
                            mesh_ij.position.x = i;
                            mesh_ij.position.y = j;
                            mesh_ij.position.z = 0.5;
                            mesh_ij.updateMatrix();
							temp.merge( mesh_ij.geometry, mesh_ij.matrix);
                        }
                    }
                }
		
				var material =
					new THREE.MeshPhongMaterial( {
						color: 0xBDA0CB,
						bumpMap: brickTexture,		
						bumpScale: 0.05
					});
                var mesh = new THREE.Mesh(temp, material);
                scene.add(mesh);             
            }


            function createRenderWorld() {
            
            	//Scene and camera
                var aspect = window.innerWidth/window.innerHeight;
                scene = new THREE.Scene();				
				camera = new THREE.PerspectiveCamera(60, aspect, 1, 10000);
	
                // Add the light.
                light= new THREE.PointLight(0xffffff, 1);
                light.position.set(1, 1, 1.3);
                scene.add(light);
                
                //Maze.
                mazeMesh = generate_maze_mesh(maze);
                     
                //Mouse.
                var g = new THREE.SphereGeometry(ballRadius, 32, 16);             
                var m = new THREE.MeshPhongMaterial({color: 0xbebebe});
                mouseMesh = new THREE.Mesh(g, m);
               	mouseMesh.scale.x = 1;
                mouseMesh.scale.y = 1.8;
                mouseMesh.scale.z = 1;
                mouseMesh.position.set(1, 1, ballRadius);
                scene.add(mouseMesh);
                
                //eye LEFT
                var g1 = new THREE.SphereGeometry(0.025, 32, 16);             
                var m1 = new THREE.MeshPhongMaterial({color: 0x000000});
                var eyeL = new THREE.Mesh(g1, m1);
                eyeL.position.set(-0.07, 0.15, ballRadius+0.0);
                mouseMesh.add(eyeL);
                
                //eye RIGHT
                var eyeR = new THREE.Mesh(g1, m1);
                eyeR.position.set(0.07, 0.15, ballRadius+0.0);
                mouseMesh.add(eyeR);
                
                //nose
                var g1 = new THREE.SphereGeometry(0.04, 32, 16);             
                var nose = new THREE.Mesh(g1, m1);
                nose.position.set(0, 0.22, ballRadius-0.1);
                mouseMesh.add(nose);
                
                //tail
                var g1 = new THREE.SphereGeometry(0.05, 32, 16);             
                var m1 = new THREE.MeshPhongMaterial({color: 0x424242});
                var tail = new THREE.Mesh(g1, m1);
                tail.scale.y = 1.3;
                tail.position.set(0, -0.2, ballRadius-0);
                mouseMesh.add(tail);
                
                //Front left legs
                var g1 = new THREE.SphereGeometry(0.05, 32, 16);             
                var m1 = new THREE.MeshPhongMaterial({color: 0x4c0000 });
                legFL = new THREE.Mesh(g1, m1);
                legFL.position.set(-0.22, 0.11, ballRadius-0.2);
                mouseMesh.add(legFL);
                //Front right legs
                legFR = new THREE.Mesh(g1, m1);
                legFR.position.set(0.22, 0.11, ballRadius-0.2);
                mouseMesh.add(legFR);
                //Back right leg
                legBR = new THREE.Mesh(g1, m1);
                legBR.position.set(-0.22, -0.11, ballRadius-0.2);
                mouseMesh.add(legBR);
                //Back left leg
                legBL = new THREE.Mesh(g1, m1);
                legBL.position.set(0.22, -0.11, ballRadius-0.2);
                mouseMesh.add(legBL);
                
                // Ball
                var g = new THREE.SphereGeometry(ballRadius, 32, 16);
                var m = new THREE.MeshPhongMaterial({color: 0xff0000});
                for (var i = 0; i < ballPosition.length; i++) {        		
        			ballMesh[i] = new THREE.Mesh( g,m );
					ballMesh[i].position.set( ballPosition[i][0], ballPosition[i][1], ballRadius);				
					scene.add(ballMesh[i] );
				}

				//Cheese
        		var g = new THREE.BoxGeometry( 0.4,0.4,0.1);
        		var m = new THREE.MeshPhongMaterial({color: 0xFFFF66,bumpMap: cheeseTexture,bumpScale: 0.05});
        		for (var i = 0; i < cheesePosition.length; i++) {        		
        			cheeseMesh[i] = new THREE.Mesh( g,m );
					cheeseMesh[i].position.set( cheesePosition[i][0], cheesePosition[i][1], ballRadius);				
					scene.add(cheeseMesh[i] );
				}
				
				//Monster							
        		var g = new THREE.SphereGeometry( ballRadius*1.2, 32, 16);
				var bumpTexture = pineappleTexture;
				var bumpScale   = 0.02;
        		var m = new THREE.MeshPhongMaterial({color: 0x33CC33,bumpMap: pineappleTexture,bumpScale: 0.02});
        		var g1 = new THREE.SphereGeometry( ballRadius/3, 32, 16);
        		var m1 = new THREE.MeshPhongMaterial({color: 0xE6E6E6});
        		var g2 = new THREE.SphereGeometry( ballRadius/4, 32, 16);
        		var m2 = new THREE.MeshPhongMaterial({color: 0x111111});
        		for (var i = 0; i < monsterPosition.length; i++) {        		
        			monsterMesh[i] = new THREE.Mesh(g, m );
        			var eye1 = new THREE.Mesh(g1,m1);
        			var eye2 = new THREE.Mesh(g1,m1);
        			var eye3 = new THREE.Mesh(g2,m2);
        			var eye4 = new THREE.Mesh(g2,m2);
        			eye1.position.set(-0.10, 0.11, ballRadius-0.05);
        			eye2.position.set(0.10, 0.11, ballRadius-0.05);
        			eye3.position.set(-0.10, 0.10, ballRadius);
        			eye4.position.set(0.10, 0.10, ballRadius);
        			monsterMesh[i].add(eye1);
        			monsterMesh[i].add(eye2);
        			monsterMesh[i].add(eye3);
        			monsterMesh[i].add(eye4);
					monsterMesh[i].position.set( monsterPosition[i][0], monsterPosition[i][1], ballRadius);				
					scene.add(monsterMesh[i]);
				}
				
                // Add the ground.
                var g = new THREE.PlaneGeometry(mazeDimension*10, mazeDimension*10, mazeDimension, mazeDimension);
                planeTexture.wrapS = planeTexture.wrapT = THREE.RepeatWrapping;
                planeTexture.repeat.set(mazeDimension*5, mazeDimension*5);
                var m = new THREE.MeshPhongMaterial({map:planeTexture, color: 0xffffff, specular: 0x050505 });
                var ground = new THREE.Mesh(g, m);         
                ground.position.set((mazeDimension-1)/2, (mazeDimension-1)/2, 0);
                scene.add(ground);                

            }


            function updatePhysicsWorld() {

                // Apply "friction". 
                var lv = wMouse.GetLinearVelocity();
                lv.Multiply(0.95);
                wMouse.SetLinearVelocity(lv);
                
                // Apply user-directed force.
                var f = new b2Vec2(keyAxis[0]*wMouse.GetMass()*0.25, keyAxis[1]*wMouse.GetMass()*0.25);
             
                wMouse.ApplyImpulse(f, wMouse.GetPosition());          
                keyAxis = [0,0];
                
                //Update monster direction
                if (monMove > 1 || monMove < -1) {
                	dir = dir * -1;
                	}
             
             	//Update monster position
                monMove = monMove + (0.01*dir);                
                for (var i = 0; i < monsterPosition.length; i++) {   
                	
                	var posX =  wMonster[i].GetPosition().x + (0.01*dir); 
                	var posY =  wMonster[i].GetPosition().y; 
                 
                	var fm = new b2Vec2(posX,posY);
                	wMonster[i].SetPosition(fm);             		 
                }
           
                //Destroy objects
                for (var i in destroy_list) {
    				wWorld.DestroyBody(destroy_list[i]);
  				}
 				 // Reset the array
  				destroy_list.length = 0;

                // Take a time step(seconds, velocityIterations, positionIteration)
                wWorld.Step(1/60, 8, 3);
            }
            

            function updateRenderWorld() {

                // Update mouse position.
                var stepX = wMouse.GetPosition().x - mouseMesh.position.x;
                var stepY = wMouse.GetPosition().y - mouseMesh.position.y;
                mouseMesh.position.x += stepX;
                mouseMesh.position.y += stepY;
          

				//Update ball poition
				for (var i = 0; i < ballPosition.length; i++) {   
					var stepX = wBall[i].GetPosition().x - ballMesh[i].position.x;
					var stepY = wBall[i].GetPosition().y - ballMesh[i].position.y;
					ballMesh[i].position.x += stepX;
					ballMesh[i].position.y += stepY;
                }
				
				//Update monster position
				for (var i = 0; i < monsterPosition.length; i++) {   
 					monsterMesh[i].rotation.x += 0.05;
 					monsterMesh[i].rotation.y += 0.05;
 					var stepX = wMonster[i].GetPosition().x - monsterMesh[i].position.x;
                	var stepY = wMonster[i].GetPosition().y - monsterMesh[i].position.y;
                	monsterMesh[i].position.x += stepX;
                	monsterMesh[i].position.y += stepY;
 				}
                
                // Update camera and light positions.			
                camera.position.x += (mouseMesh.position.x - camera.position.x) ;
                camera.position.y += (mouseMesh.position.y - camera.position.y) ;
                camera.position.z +=  0//(5 - camera.position.z) * 0.1;	
                light.position.x = camera.position.x;
                light.position.y = camera.position.y;
                light.position.z = camera.position.z - 3.7;
				
            }


            function gameLoop() {
            
                switch(gameState) {
                
                    case 'initialize':
                        maze = generateSquareMaze(mazeDimension);
                        maze[mazeDimension-2][mazeDimension-1] = false;
                        createPhysicsWorld();
                        createRenderWorld();
                        camera.position.set(1, 1, 5);
                        light.position.set(1, 1, 1.3);
                        light.intensity = 0;
                    	gameState = 'fade in';                    
                        break;
                        
                    case 'fade in':               
                        light.intensity += 0.1 * (1.0 - light.intensity);
                        renderer.render(scene, camera);
                        if (Math.abs(light.intensity - 1.0) < 0.05) {
                            light.intensity = 1.0;
                             gameState = 'play'
                        }               
                        break;

                    case 'play':
                        updatePhysicsWorld();
                        updateRenderWorld();
                        renderer.render(scene, camera);

                        // Check for victory.
                        var mazeX = Math.floor(mouseMesh.position.x + 0.5);
                        var mazeY = Math.floor(mouseMesh.position.y + 0.5);
    
                        if (mazeX == mazeDimension && mazeY == mazeDimension-2) { 
                        	soundEnd.play();
                        	time = 400;
                            gameState = 'fade out';
                            console.log("w ", w);
                            w=0;
                           
                        }
                        //Update cheese
                        $('#cheese').html('Cheese ' + cheeseCount);
                        break;
                
                    case 'fade out':
                        updatePhysicsWorld();
                        updateRenderWorld();
                       
                        //light.intensity += 0.1 * (0.0 - light.intensity);
                        renderer.render(scene, camera);
                        renderParticles();
                        w++;
                        
                        if (w > time){
                        //if (Math.abs(light.intensity - 0.0) < 0.1) {

                            light.intensity = 0.0;
                            renderer.render(scene, camera);
                            gameState = 'initialize'
                            w = 0;
                            first = 0;
                            cheeseCount = 0;
                        }
                       
                        break;
                        
                }
            
                requestAnimationFrame(gameLoop);

            }
            

            function renderParticles(){
            	if (first === 0){
            		startParticles();
            		first = 1;
            	}
				var time1 = Date.now() * 0.000005;
				for ( i = 0; i < scene.children.length; i ++ ) {
					var object = scene.children[ i ];
					if ( object instanceof THREE.PointCloud ) {
						object.rotation.y = time1 * ( i < 4 ? i + 1 : - ( i + 1 ) );
					}
				}

				for ( i = 0; i < materials.length; i ++ ) {

					color = parameters[i][0];

					h = ( 360 * ( color[0] + time1 ) % 360 ) / 360;
					materials[i].color.setHSL( h, color[1], color[2] );

				}


            }

            
            function startParticles(){
            		
            		geometry = new THREE.Geometry();				
					for ( i = 0; i < 20000; i ++ ) {

						var vertex = new THREE.Vector3();
						vertex.x = Math.random() * 2000 - 1000;
						vertex.y = Math.random() * 2000 - 1000;
						vertex.z = Math.random() * 2000 - 1000;

						geometry.vertices.push( vertex );

					}
					parameters = [
						[ [1, 1, 0.5], 5 ],
						[ [0.95, 1, 0.5], 4 ],
						[ [0.90, 1, 0.5], 3 ],
						[ [0.85, 1, 0.5], 2 ],
						[ [0.80, 1, 0.5], 1 ]
					];							
					texture = THREE.ImageUtils.loadTexture('images/particle.png');			
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
            
	            }
                 

            function index(array,x,y){
            	//Index multidimensional  array
            	var len = array.length;
            	if (x != -1){
            		for (var i = 0; i < len; i++){
            			if (array[i][0] === x){
    						for (var j = 0; j < array[i].length; j++){
       					 		if (array[i][j] === y){
           			 				return i;  
           			 				break;   
           			 		}     
    					}
    				}
    			}
    			} else if(x === -1){
    				for (var i = 0; i < len; i++){
            			for (var j = 0; j < array[i].length; j++){
       					 		if (array[i][j] === y){
           			 				return i;  
           			 				break;   
           			 			}     
    						}
    				}   				
    			}
    			return -1;       
            }


            function onResize() {
                renderer.setSize(window.innerWidth, window.innerHeight);
                camera.aspect = window.innerWidth/window.innerHeight;
                camera.updateProjectionMatrix();
            }
            
            
            function onMoveKey(axis) {
            	//get direction
                keyAxis = axis.slice(0);
				//Rotate Mouse
                mouseMesh.rotation.set(0,0, Math.PI/180*270* keyAxis[0]);
                if (keyAxis[1] === -1){
                	  mouseMesh.rotation.set(0,0, Math.PI/180*180);
                	}
                //Move feet	every 15 steps
                if(w === 15) {
                	legFR.position.y = legFR.position.y + (counter * 0.03);
                	legBR.position.y = legBR.position.y + (counter * 0.03);
                	//console.log(legFR.position.y);
                	counter = counter * -1;
                	legFL.position.y =legFL.position.y + (counter * 0.03);
                	legBL.position.y = legBL.position.y + (counter * 0.03);
                	w = 0;
                }else {
                  w++;
                }   
            }
            
            
            function init() {    
                // Create the renderer.
                renderer = new THREE.WebGLRenderer();
                renderer.setSize(window.innerWidth, window.innerHeight);
                document.body.appendChild(renderer.domElement);
				

                // Bind keyboard and resize events.
                KeyboardJS.bind.axis('left', 'right', 'down', 'up', onMoveKey);
                KeyboardJS.bind.axis('h', 'l', 'j', 'k', onMoveKey);
                $(window).resize(onResize);
                
                // Set the initial game state.
                gameState = 'initialize';
                
                // Start the game loop.
                requestAnimationFrame(gameLoop);

            }
            
            


