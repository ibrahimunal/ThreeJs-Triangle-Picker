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
// import { trimWhiteSpaces , computeBoundsTree} from '../shadow/string-helper';





// THREE.Mesh.prototype.raycast = acceleratedRaycast;
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
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


    const params = {
      size: 3,
      rotate: false,
    };
    
    let stats;
    let scene, camera, renderer, controls;
    let targetMesh, brushMesh;
    let mouse = new THREE.Vector2();
    let mouseType = - 1;
    let lastTime;
    let loader;
    
    function init() {
    
      const bgColor = 0x8FD3EB / 2;
      loader= new STLLoader();;
      // renderer setup
      renderer = new THREE.WebGLRenderer( { antialias: true } );
      renderer.setPixelRatio( window.devicePixelRatio );
      renderer.setSize( window.innerWidth, window.innerHeight );
      renderer.setClearColor( bgColor, 1 );
      renderer.gammaOutput = true;
      document.body.appendChild( renderer.domElement );
    
      // scene setup
      scene = new THREE.Scene();
      // scene.fog = new THREE.Fog( 0x263238 / 2, 20, 60 );
    
      const light = new THREE.DirectionalLight( 0xffffff, 0.5 );
      light.position.set( 1, 1, 1 );
      scene.add( light );
      scene.add( new THREE.AmbientLight( 0xffffff, 0.4 ) );
    
      // geometry setup
      const radius = 1;
      const tube = 0.4;
      const tubularSegments = 100;
      const radialSegments = 100;
      
      const knotGeometry = new THREE.TorusKnotBufferGeometry( radius, tube, tubularSegments, radialSegments );

     
      
      loader.load("../assets/simple.stl", function(geometry) {
        const colorArray = new Uint8Array( geometry.attributes.position.count * 3 );
        colorArray.fill( 255 );
        const colorAttr = new THREE.BufferAttribute( colorArray, 3, true );
        // colorAttr.dynamic = true;
        geometry.setAttribute( 'color', colorAttr );
      
        const material = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 0.3, metalness: 0, vertexColors: true } );
        // var geo = new THREE.Geometry().fromBufferGeometry( geometry );
          console.log(typeof geometry);
          // var material = new THREE.MeshPhongMaterial({
     
          //   color: 0x34c3eb ,  
          // //   wireframe: false,
          // // clippingPlanes:planes,
          //   // transparent: true, 
          //   side: THREE.DoubleSide,
          //     vertexColors: true,
          //     // clipIntersection : false,
          //   // depthTest: true, 
          //   // depthWrite: true, 
          //   // polygonOffset: true,
          //   // polygonOffsetFactor: -4, 
          //   // flatShading : THREE.SmoothShadings
          // });     
          // const count = geometry.attributes.position.count; 
          // geometry.setAttribute('color',new THREE.BufferAttribute( new Float32Array(count*3), 3 ));

          // // const positions1 = geometry.attributes.position;
          // const colors1 = geometry.attributes.color;
          // for ( let i = 0; i < count; i ++ ) {
          //   colors1.setXYZ( i,color.r+20, color.g+100, color.b +100);
          // }
          // let mesh = new THREE.MeshPhongMaterial(geometry, material);
          targetMesh = new THREE.Mesh( geometry, material );
          targetMesh.geometry.computeBoundsTree();
   
          //  var geo = new THREE.EdgesGeometry( mesh.geometry ); // or WireframeGeometry
          //  var mat = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 2 } );
          // mesh.geometry.attributes.color.needsUpdate = true;
          //  var wireframe = new THREE.LineSegments( geo, mat );
          //  mesh.add( wireframe );
          // scene.add(mesh);
          scene.add( targetMesh );
          render();

        });

      // console.log(targetMesh +" is here");

    
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
    
      // camera setup
      camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 10000 );
      camera.position.set( 10, 70, 10 );
      // camera.far = 100;
      camera.updateProjectionMatrix();
      camera.up = new THREE.Vector3( 0, 0, 1 );
      controls = new OrbitControls( camera, renderer.domElement );
    
      // stats setup
      // stats = new Stats();
      // document.body.appendChild( stats.dom );
    
      const gui = new GUI();
      gui.add( params, 'size' ).min( 0.1 ).max( 10 ).step( 0.1 );
      // gui.add( params, 'rotate' );
      gui.open();
    
      controls.addEventListener( 'start', function () {
    
        this.active = true;
    
      } );
    
      controls.addEventListener( 'end', function () {
    
        this.active = false;
    
      } );
    
      window.addEventListener( 'resize', function () {
    
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    
        renderer.setSize( window.innerWidth, window.innerHeight );
    
      }, false );
    
      window.addEventListener( 'mousemove', function ( e ) {
    
        mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
    
      } );
    
      window.addEventListener( 'mousedown', function ( e ) {
    
        mouseType = e.button;
    
      } );
    
      window.addEventListener( 'mouseup', function () {
    
        mouseType = - 1;
    
      } );
    
      window.addEventListener( 'contextmenu', function ( e ) {
    
        e.preventDefault();
    
      } );
    
      window.addEventListener( 'wheel', function ( e ) {
    
        let delta = e.deltaY;
    
        if ( e.deltaMode === 1 ) {
    
          delta *= 40;
    
        }
    
        if ( e.deltaMode === 2 ) {
    
          delta *= 40;
    
        }
    
        params.size += delta * 0.005;
        params.size = Math.max( Math.min( params.size, 7 ), 0.1 );
    
        gui.updateDisplay();
    
      } );
    
      lastTime = window.performance.now();
    
    }
    
    function render() {
    
      requestAnimationFrame( render );
    
      // stats.begin();
    
      const geometry = targetMesh.geometry;
      const bvh = geometry.boundsTree;
      const colorAttr = geometry.getAttribute( 'color' );
      const indexAttr = geometry.index;
    
      if ( controls.active ) {
    
        brushMesh.visible = false;
    
      } else {
    
        brushMesh.scale.setScalar( params.size );
    
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera( mouse, camera );
        // raycaster.firstHitOnly = true;
    
        const res = raycaster.intersectObject( targetMesh, true );
        // console.log(res);
        if ( res.length ) {
    
          brushMesh.position.copy( res[ 0 ].point );
          controls.enabled = false;
          brushMesh.visible = true;
          console.log(res[ 0 ].point);

          const inverseMatrix = new THREE.Matrix4();
          // inverseMatrix.copy( targetMesh.matrixWorld ).invert();
    
          const sphere = new THREE.Sphere();
          sphere.center.copy( brushMesh.position ).applyMatrix4( inverseMatrix );
          sphere.radius = params.size;
    
          const indices = [];
          const tempVec = new THREE.Vector3();
          bvh.shapecast(
            targetMesh,
            box => {
    
              const intersects = sphere.intersectsBox( box );
              const { min, max } = box;
              if ( intersects ) {
    
                for ( let x = 0; x <= 1; x ++ ) {
    
                  for ( let y = 0; y <= 1; y ++ ) {
    
                    for ( let z = 0; z <= 1; z ++ ) {
    
                      tempVec.set(
                        x === 0 ? min.x : max.x,
                        y === 0 ? min.y : max.y,
                        z === 0 ? min.z : max.z
                      );
                      if ( ! sphere.containsPoint( tempVec ) ) {
    
                        return INTERSECTED;
    
                      }
    
                    }
    
                  }
    
                }
    
                return CONTAINED;
    
              }
    
              return intersects ? INTERSECTED : NOT_INTERSECTED;
    
            },
            ( tri, a, b, c, contained ) => {
    
              if ( contained || tri.intersectsSphere( sphere ) ) {
    
                indices.push( a, b, c );
    
              }
    
              return false;
    
            }
          );
    
          if ( mouseType === 0 || mouseType === 2 ) {
    
            let r = 255, g = 255, b = 255;
            if ( mouseType === 0 ) {
    
              r = 15;
              g = 78;
              b = 85;
    
            }
    
            for ( let i = 0, l = indices.length; i < l; i ++ ) {
    
              const i2 = indexAttr.getX( indices[ i ] );
              colorAttr.setX( i2, r );
              colorAttr.setY( i2, g );
              colorAttr.setZ( i2, b );
    
            }
            colorAttr.needsUpdate = true;
    
          }
    
        } else {
    
          controls.enabled = true;
          brushMesh.visible = false;
    
        }
    
      }
    
      const currTime = window.performance.now();
      if ( params.rotate ) {
    
        const delta = currTime - lastTime;
        targetMesh.rotation.y += delta * 0.001;
    
      }
      lastTime = currTime;
    
      renderer.render( scene, camera );
      // stats.end();
    
    }
    
    
    init();
      
    
  }
}
