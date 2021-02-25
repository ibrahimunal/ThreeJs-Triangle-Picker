import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
// import * as $ from 'jquery';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import {GUI}  from 'three/examples/jsm/libs/dat.gui.module';
import { acceleratedRaycast, computeBoundsTree, disposeBoundsTree, CONTAINED, INTERSECTED, NOT_INTERSECTED } from '../../../three-src/index';
import * as $ from 'jquery/dist/jquery.min.js';
import Stats from 'three/examples/jsm/libs/stats.module';
import { Color, Mesh, TorusGeometry } from 'three/build/three.module';
import {DecalGeometry} from  'three/examples/jsm/geometries/DecalGeometry.js';
import {Camera} from 'three/src/cameras/Camera.js';
import { Frustum } from 'three';

THREE.Mesh.prototype.raycast = acceleratedRaycast;
THREE.BufferGeometry.prototype.computeBoundingBox = computeBoundsTree;
THREE.BufferGeometry.prototype.dispose = disposeBoundsTree;
@Component({
  selector: 'app-shadow',
  templateUrl: './shadow.component.html',
  styleUrls: ['./shadow.component.css'],
})
export class ShadowComponent implements OnInit {

  private bufferGeo: THREE.BufferGeometry;
  constructor() {}
  
  @ViewChild('inputHolder') someInput: ElementRef;
  ngAfterViewInit() {
    console.log(this.someInput.nativeElement);

  }
  ngOnInit(): void {
    
    
    this.main();

    
  }
  


  reRender() {
    const event = new Event('resize');
    setTimeout(() => {
      dispatchEvent(event);
    });
  }
  testFunc(){
    console.log("test");
  }

  main() {



    let scene,helperScene, renderer, object, stats, helpScene;
			let planes, planeObjects, planeHelpers;
      let clock;
      let targetMesh, brushMesh;
      var raycaster = new THREE.Raycaster();
      var mesh,decalLine;
      const loader= new STLLoader();;
    	var	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 10000 );
      // var container = document.getElementById( 'container' );
      var intersects = [];
      var selectionColor = new THREE.Color("red");

      var intersection = {
        intersects: false,
        point: new THREE.Vector3(),
        normal: new THREE.Vector3()
      };
			const params = {
        
        animate: false,
				planeX: {
          
					constant: 130,
					negated: false,
					displayHelper: false
          
				},
				planeY: {
          
          constant: 130,
					negated: false,
					displayHelper: false
          
				},
				planeZ: {
          
          constant: 130,
					negated: false,
					displayHelper: false
          
				}
        

      };
      
            let xPlusButton = document.getElementById('Xplus');
            let xMinusButton = document.getElementById('Xminus');
            let yPlusButton = document.getElementById('Yplus');
            let yMinusButton = document.getElementById('Yminus');
            let zPlusButton = document.getElementById('Zplus');
            let zMinusButton = document.getElementById('Zminus');
            let canvasElement = document.getElementById('3dCanvas');            
            
            init();
            animate();
            document.addEventListener("contextmenu", onDocumentMouseDown, false);

            canvasElement.addEventListener("click", paint2, false);
            // document.addEventListener("mousemove", cursorMove, false);
          

            var points = [
              new THREE.Vector3(),
              new THREE.Vector3()
          ]
          var clicks = 0;
      
        var markerA = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 10, 20),
        new THREE.MeshBasicMaterial({
          color: 0x4b0082,
          
        })
        );
      var markerB = markerA.clone();
      var markers = [
        markerA, markerB
      ];
      scene.add(markerA);
      scene.add(markerB);
      var lineGeometry = new THREE.Geometry();
      lineGeometry.vertices.push(new THREE.Vector3());
      lineGeometry.vertices.push(new THREE.Vector3());
      var lineMaterial = new THREE.LineBasicMaterial({
        color: 0xff0000,
      });
      var line = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(line);
      
      var radius = 1.1;
      var marker;
      function initMarker() {
        console.log('initiating marker');
        marker = new THREE.Mesh(
          // camera.position.set( 0, 100, 100 );
                
          new THREE.SphereGeometry(10),
          // new THREE.BoxGeometry(), 
          new THREE.MeshBasicMaterial({color: "blue", transparent: true, opacity:0.8}));
          // marker.rotateOnAxis(new THREE.Vector3(0,0,1))
          //  marker.rotation.set(new THREE.Vector3( 0, 0, Math.PI / 2));
          marker.rotation.y = Math.PI / 2;
          // scene.add(marker);
      }

      initMarker();

      var intersection = {
        intersects: false,
        point: new THREE.Vector3(),
        normal: new THREE.Vector3()
      };
      // const geometry = new THREE.BoxGeometry( 1, 1, 1 );
      // const material = new THREE.MeshBasicMaterial( {color: 0x00ff00,vertexColors:true});
      // const cube = new THREE.Mesh( geometry, material );
      var mouseVector = new THREE.Vector3();
      var mouse = new THREE.Vector2();
      
      // var decalMaterial = new THREE.MeshPhongMaterial( { 
      //   specular: 0xffffff,
      //   shininess: 10,
      //   map:textureLoader.load( 'src/assets/splatter.png' ), 
      //   normalMap: textureLoader.load( 'src/assets/wrinkle-normal.jpg' ),
      //   normalScale: new THREE.Vector2( .15, .15 ),
      //   transparent: true, 
      //   depthTest: true, 
      //   depthWrite: false, 
      //   polygonOffset: true,
      //   polygonOffsetFactor: -4, 
      //   wireframe: true 
      // });
        var decals = [];
        var decalHelper, mouseHelper;
        var p = new THREE.Vector3( 0, 0, 0 );
        var r = new THREE.Vector3( 0, 0, 0 );
        var s = new THREE.Vector3( 10, 10, 10 );
        var up = new THREE.Vector3( 0, 1, 0 );
        var check = new THREE.Vector3( 1, 1, 1 );

      
      function setLine(vectorA, vectorB) {
        line.geometry.vertices[0].copy(vectorA);
        line.geometry.vertices[1].copy(vectorB);
        line.geometry.verticesNeedUpdate = true;
      }
      function getIntersections(event) {
        var vector = new THREE.Vector2();
      
        vector.set(
          event.clientX / window.innerWidth * 2 - 1,
          -(event.clientY / window.innerHeight) * 2 + 1
        );
      
        raycaster.setFromCamera(vector, camera);
          
        var intersects = raycaster.intersectObjects([mesh]);
        return intersects;
      }
      var distancePlace = document.getElementById("distancePlace");
      function onDocumentMouseDown(event) {
        var intersects = getIntersections(event);
         console.log(intersects);
        if (intersects.length > 0) {
          points[clicks].copy(intersects[0].point);
          console.log(intersects[0]);
          markers[clicks].position.copy(intersects[0].point);
          setLine(intersects[0].point, intersects[0].point);
          clicks++;
          if (clicks > 1){
            var distance =  Math.round(points[0].distanceTo(points[1])*100)/100;
            distancePlace.innerText = distance.toString();
            distancePlace.innerText += " mm"
            setLine(points[0], points[1]);
            clicks = 0;
          }
        }
      }

			function createPlaneStencilGroup( geometry, plane, renderOrder ) {

				const group = new THREE.Group();
				const baseMat = new THREE.MeshBasicMaterial();
				baseMat.depthWrite = false;
				baseMat.depthTest = false;
				baseMat.colorWrite = false;
				baseMat.stencilWrite = true;
				baseMat.stencilFunc = THREE.AlwaysStencilFunc;

				// back faces
				const mat0 = baseMat.clone();
				mat0.side = THREE.BackSide;
				mat0.clippingPlanes = [ plane ];
				mat0.stencilFail = THREE.IncrementWrapStencilOp;
				mat0.stencilZFail = THREE.IncrementWrapStencilOp;
				mat0.stencilZPass = THREE.IncrementWrapStencilOp;

				const mesh0 = new THREE.Mesh( geometry, mat0 );
				mesh0.renderOrder = renderOrder;
				group.add( mesh0 );

				// front faces
				const mat1 = baseMat.clone();
				mat1.side = THREE.FrontSide;
				mat1.clippingPlanes = [ plane ];
				mat1.stencilFail = THREE.DecrementWrapStencilOp;
				mat1.stencilZFail = THREE.DecrementWrapStencilOp;
				mat1.stencilZPass = THREE.DecrementWrapStencilOp;

				const mesh1 = new THREE.Mesh( geometry, mat1 );
				mesh1.renderOrder = renderOrder;

				group.add( mesh1 );

				return group;

			}

			function init() {


        helperScene = new THREE.Scene();
        clock = new THREE.Clock();
        
				scene = new THREE.Scene();
        
        

        // decalLine = new THREE.Line( new THREE.Geometry( ), new THREE.LineBasicMaterial( { linewidth: 4 }) );
        // decalLine.geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
        // decalLine.geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
        // scene.add( decalLine );


        
                camera.position.set( 250, 0, 0 );
                // camera.position.set( 0, 100, 100 );
               
                console.log(xPlusButton);
                xPlusButton.addEventListener('click', function(e){
                    e.preventDefault();
                
                    camera.position.set( 250, 0, 0 );
                    // camera.up = new THREE.Vector3( 0, 0, 1 );
                    controls.update();
                
                    console.log("Hello World X");
                })
                xMinusButton.addEventListener('click', function(e){
                    e.preventDefault();
                
                    camera.position.set( -250, 0, 0 );
                    // camera.up = new THREE.Vector3( 0, 0, 1 );

                    controls.update();
                    console.log("Hello World X");

                })
                
                yPlusButton.addEventListener('click', function(e){
                    e.preventDefault();
                    camera.position.set( 0, 250, 250 );
                
                    // camera.up = new THREE.Vector3( 0, 0, 0 );
                    // camera.up = new THREE.Vector3( 0, 0, 1 );
                    controls.update();
                    console.log("Hello World Y");
                
                })
                
                yMinusButton.addEventListener('click', function(e){
                    e.preventDefault();
                    camera.position.set( 0, -250, 250 );
                
                    // camera.up = new THREE.Vector3( 0, 0, 0 );
                    // camera.up = new THREE.Vector3( 0, 0, 1 );
                    controls.update();
                    console.log("Hello World Y");
                
                })
                
                zPlusButton.addEventListener('click', function(e){
                  e.preventDefault();
                    camera.position.set( 0, 250, 250 );
                
                    // camera.up = new THREE.Vector3( 0, 0, 1 );
                    controls.update();

                             console.log("Hello World Z");
                
                })
                
                zMinusButton.addEventListener('click', function(e){
                    camera.position.set( 0, 250, -250 );
                
                    e.preventDefault();
                    // camera.up = new THREE.Vector3( 0, 0, 1 );
                    controls.update();

                             console.log("Hello World Z");
                
                })



                camera.up = new THREE.Vector3( 0, 0, 1 );

				scene.add( new THREE.AmbientLight( 0xffffff, 0.5 ) );

				var light = new THREE.DirectionalLight( 0xffffff );
                light.position.set( 0, 1, 1 ).normalize();
                scene.add(light);

				planes = [
					new THREE.Plane( new THREE.Vector3( - 1, 0, 0 ) ,1 ),
					new THREE.Plane( new THREE.Vector3( 0, - 1, 0 ) ,1 ),
					new THREE.Plane( new THREE.Vector3( 0, 0, - 1 ) ,1 )
				];

				planeHelpers = planes.map( p => new THREE.PlaneHelper( p, 2, 0xffffff ) );
				planeHelpers.forEach( ph => {

					ph.visible = false;
					scene.add( ph );

                } );

                object = new THREE.Group();
                scene.add( object ); 
                const material = new THREE.MeshStandardMaterial( {

					color: 0xFFC107,
					metalness: 0.1,
					roughness: 0.75,
					clippingPlanes: planes,
					clipShadows: true,
					shadowSide: THREE.DoubleSide,

				} );

        const color = new THREE.Color(0xfcb103);
           
				// const geometry = new THREE.TorusKnotBufferGeometry( 0.4, 0.15, 220, 60 );
				// Set up clip plane rendering
				planeObjects = [];
				const planeGeom = new THREE.PlaneBufferGeometry( 150, 150);
        
        // loadFileButton.addEventListener('change' , function (e){
              
        //   var reader = new FileReader();


        //   })

          // function onFileSelected(event) {
          //   var selectedFile = event.target.files[0];
          //   var reader = new FileReader();
          
          //   var imgtag = document.getElementById("myimage");
          //   imgtag.title = selectedFile.name;
          
          //   reader.onload = function(event) {
          //     imgtag.src = event.target.result;
          //   };
          
          //   reader.readAsDataURL(selectedFile);
          // }
  
        //   $("#inputHolder").on("change",function(){
        //     console.log("triggerlandimm");
        // });

        // canvasElement.onchange = function () {
        //   alert('Selected file: ' + this.value);
        // };\

        // function showname () {
        //   var name = canvasElement.; 
        //   alert('Selected file: ' + name.files.item(0).name);
        //   alert('Selected file: ' + name.files.item(0).size);
        //   alert('Selected file: ' + name.files.item(0).type);
        // };
      //   $(canvasElement).ready(function(){
      //     $("3dCanvas").click(function(){
      //       console.log("asdasd");

      //     });
      //   });

      //   $('#inputHolder').change(function() {
      //     alert($(this).val()); 
      //     console.log("asdasd");
      //  });
      function createBrush(){
        const brushGeometry = new THREE.SphereBufferGeometry( 1, 40, 40 );
        const brushMaterial = new THREE.MeshStandardMaterial( {
          color: 0xEC407A,
          roughness: 0.75,
          metalness: 0,
          transparent: true,
          opacity: 0.5,
          premultipliedAlpha: true,
          emissive: 0xEC407A,
          emissiveIntensity: 0.5,
        } );
      
        brushMesh = new THREE.Mesh( brushGeometry, brushMaterial );
        scene.add( brushMesh );
      }

      createBrush();

      $('#inputHolder').change(function() {
        var filePath = $(this).val();
        var stlName =filePath.split("\\");

        stlName =(stlName[stlName.length -1]);
        console.log(stlName);
        alert($(this).val()); 
        loader.load("../assets/"+stlName, function(geometry) {
          var geo = new THREE.Geometry().fromBufferGeometry( geometry );
            geometry.computeBoundingBox();
            console.log(geometry);
            var material = new THREE.MeshPhongMaterial({
              
              // color: 0x34c3eb ,  
            //   wireframe: false,
            clippingPlanes:planes,
              // transparent: true, 
              side: THREE.DoubleSide,
                vertexColors: true,
                clipIntersection : false,
              // depthTest: true, 
              // depthWrite: true, 
              // polygonOffset: true,
              // polygonOffsetFactor: -4, 
              // flatShading : THREE.SmoothShadings
            });     
            // const count = geometry.attributes.position.count; 
            // geometry.setAttribute('color',new THREE.BufferAttribute( new Float32Array(count*3), 3 ));

            // // const positions1 = geometry.attributes.position;
            // const colors1 = geometry.attributes.color;
            // for ( let i = 0; i < count; i ++ ) {
            //   colors1.setXYZ( i,color.r+20, color.g+100, color.b +100);
            // }
            // let mesh = new THREE.MeshPhongMaterial(geometry, material);
            mesh = new THREE.Mesh(geo, material);
            mesh.geometry.frustumCulled = false;
            //  var geo = new THREE.EdgesGeometry( mesh.geometry ); // or WireframeGeometry
            console.log(mesh);
            //  var mat = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 2 } );
            // mesh.geometry.attributes.color.needsUpdate = true;
            //  var wireframe = new THREE.LineSegments( geo, mat );
            //  mesh.add( wireframe );
            // scene.add(mesh);
            console.log("function workssss");
            // painter = new THREE.TexturePainter( renderer, camera, mesh );
            for ( let i = 0; i < 3; i ++ ) {

                const poGroup = new THREE.Group();
                const plane = planes[ i ];
                const stencilGroup = createPlaneStencilGroup( geo, plane, i + 1 );

                // plane is clipped by the other clipping planes
                const planeMat =
                    new THREE.MeshStandardMaterial( {

                        color: 0x34c3eb,
                        metalness: 0.1,
                        roughness: 0.75,
                        clippingPlanes: planes.filter( p => p !== plane ),

                        stencilWrite: true,
                        stencilRef: 0,
                        stencilFunc: THREE.NotEqualStencilFunc,
                        stencilFail: THREE.ReplaceStencilOp,
                        stencilZFail: THREE.ReplaceStencilOp,
                        stencilZPass: THREE.ReplaceStencilOp,

                    } );
                const po = new THREE.Mesh( planeGeom, planeMat );
                po.onAfterRender = function ( renderer ) {

                    renderer.clearStencil();

                };

                po.renderOrder = i + 1.1;

                object.add( stencilGroup );
                poGroup.add( po );
                planeObjects.push( po );
                scene.add( poGroup );

            }
            const clippedColorFront = new THREE.Mesh( geo, material );
            clippedColorFront.castShadow = true;
            clippedColorFront.renderOrder = 6;
            object.add( clippedColorFront );
            
                        
          });
     });


            



                  mouseHelper = new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 10 ), new THREE.MeshNormalMaterial() );
                    	// scene.add( mouseHelper );

	
				// add the color
			


				const ground = new THREE.Mesh(
					new THREE.PlaneBufferGeometry( 9, 9, 1, 1 ),
					new THREE.ShadowMaterial( { color: 0xffffff, opacity: 0.50, side: THREE.DoubleSide } )
				);

				ground.rotation.x = - Math.PI / 2; // rotates X/Y to X/Z
				ground.position.y = - 1;
				ground.receiveShadow = true;
			     scene.add( ground );

				// Stats
				// stats = new Stats();
				// document.body.appendChild( stats.dom );

				// Renderer
				renderer = new THREE.WebGLRenderer( { antialias: true } );
				// renderer.shadowMap.enabled = true;
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.setClearColor( 0x263238 );
				// window.addEventListener( 'resize', onWindowResize, false );
				canvasElement.appendChild( renderer.domElement );

				renderer.localClippingEnabled = true;

				// Controls
				const controls = new OrbitControls( camera, renderer.domElement );
				// controls.minDistance = 20;
        // controls.maxDistance = 100;
				controls.update();
        // controls.addEventListener( 'end', function() {
        //     // checkIntersection();
        //     // shoot();
        // } );
				// GUI
				const gui = new GUI();
				gui.add( params, 'animate' );
        planes[0].constant =150;
				const planeX = gui.addFolder( 'planeX' );
				planeX.add( params.planeX, 'displayHelper' ).onChange( v => planeHelpers[ 0 ].visible = v );
				planeX.add( params.planeX, 'constant' ).min( - 130 ).max( 130 ).onChange( d => planes[ 0 ].constant = d );
				planeX.add( params.planeX, 'negated' ).onChange( () => {

					planes[ 0 ].negate();
					params.planeX.constant = planes[ 0 ].constant;

				} );
				planeX.open();
        planes[1].constant =150;
				const planeY = gui.addFolder( 'planeY' );
				planeY.add( params.planeY, 'displayHelper' ).onChange( v => planeHelpers[ 1 ].visible = v );
				planeY.add( params.planeY, 'constant' ).min( - 130 ).max( 130 ).onChange( d => planes[ 1 ].constant = d );
				planeY.add( params.planeY, 'negated' ).onChange( () => {

					planes[ 1 ].negate();
					params.planeY.constant = planes[ 1 ].constant;

				} );
				planeY.open();
        planes[2].constant =150;
				const planeZ = gui.addFolder( 'planeZ' );
				planeZ.add( params.planeZ, 'displayHelper' ).onChange( v => planeHelpers[ 2 ].visible = v );
				planeZ.add( params.planeZ, 'constant' ).min( - 130 ).max( 130 ).onChange( d => planes[ 2 ].constant = d );
				planeZ.add( params.planeZ, 'negated' ).onChange( () => {

					planes[ 2 ].negate();
					params.planeZ.constant = planes[ 2 ].constant;

				} );
				planeZ.open();

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function animate() {

				const delta = clock.getDelta();

				requestAnimationFrame( animate );

				if ( params.animate ) {

					object.rotation.x += delta * 0.5;
					object.rotation.y += delta * 0.2;

				}

				for ( let i = 0; i < planeObjects.length; i ++ ) {

					const plane = planes[ i ];
					const po = planeObjects[ i ];
					plane.coplanarPoint( po.position );
					po.lookAt(
						po.position.x - plane.normal.x,
						po.position.y - plane.normal.y,
						po.position.z - plane.normal.z,
					);

				}

				// stats.begin();
				renderer.render( scene, camera );
				// stats.end();

      }

      function paint2( event ) {

        event.preventDefault();
      
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        raycaster.setFromCamera( mouse, camera );
        
        var intersects = getIntersections(event);
        console.log(intersects);
        if (intersects.length === 0) return;
     
        
        // find the new indices of faces

        // faceIdx2 = faceIdx1 % 2 === 0 ? faceIdx1 + 1: faceIdx1 - 1;

        //intersects[0].face.color.setHex(0xe6e566);
        
        // const intersection = intersects[0];
        // const faceIndex = intersection.faceIndex;
        // const object = intersection.object;
        var faceIdx1 = intersects[0].faceIndex;
        setFaceColor(faceIdx1, selectionColor);

        // object.geometry.faces[ faceIndex ].color.set( Math.random() * 0xffffff );
        // mesh.geometry.colorsNeedUpdate = true;


        // console.log(faceIdx2);

        console.log(mesh);

        
        // set newly selected faces to red
        // setFaceColor(faceIdx1, selectionColor);
        // setFaceColor(faceIdx2, selectionColor);
      
      }
      // jQuery(document).ready(function() {

      //   var mouseX = 0, mouseY = 0;
      //   var xp = 0, yp = 0;
         
      //   $(document).mousemove(function(e){
      //     mouseX = e.pageX - 30;
      //     mouseY = e.pageY - 30; 
      //   });
          
      //   setInterval(function(){
      //     xp += ((mouseX - xp)/6);
      //     yp += ((mouseY - yp)/6);
      //     $("#circle").css({left: xp +'px', top: yp +'px'});
      //   }, 20);
      
      // });
      function cursorMove(event) {

        event.preventDefault();
      
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        raycaster.setFromCamera( mouse, camera );
        
        var intersects = getIntersections(event);
        console.log(intersects);

        var vector = new THREE.Vector3(mouse.x, mouse.y, 0);
        vector.unproject( camera );
        var dir = vector.sub( camera.position ).normalize();
        var distance = - camera.position.z / dir.z;
        var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );
        marker.position.copy(pos);
        
      
      }

      function setFaceColor(idx, color){
        if (idx === -1) return;
        for(var i=idx; i<idx+5; i++){
      
            mesh.geometry.faces[i].color.copy(color);
          
        }
        mesh.geometry.colorsNeedUpdate = true;
      }

      // window.addEventListener("mousedown", function(event){
      //   raycaster.setFromCamera(mouse, camera);
      //   intersects = getIntersections(event);
      //   console.log(intersects);
      //   if (intersects.length === 0) return;
        
      //   // set previously selected faces to white
      //   setFaceColor(faceIdx1, baseColor);
      //   setFaceColor(faceIdx2, baseColor);
        
      //   // find the new indices of faces
      //   faceIdx1 = intersects[0].faceIndex;
      //   faceIdx2 = faceIdx1 % 2 === 0 ? faceIdx1 + 1: faceIdx1 - 1;
        
      //   // set newly selected faces to red
      //   setFaceColor(faceIdx1, selectionColor);
      //   setFaceColor(faceIdx2, selectionColor);
      // }, false)
      
    
  }
}
