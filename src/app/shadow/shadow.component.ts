import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-shadow',
  templateUrl: './shadow.component.html',
  styleUrls: ['./shadow.component.css'],
})
export class ShadowComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    this.main();
  }

  addPlane(scene) {
    const planeSize = 40;

    const loader = new THREE.TextureLoader();
    const texture = loader.load(
      'https://threejsfundamentals.org/threejs/resources/images/checker.png'
    );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);

    const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.receiveShadow = true;
    mesh.rotation.x = Math.PI * -0.5;
    mesh.position.y = -0.5;
    scene.add(mesh);
    this.reRender();
  }

  reRender() {
    const event = new Event('resize');
    setTimeout(() => {
      dispatchEvent(event);
    });
  }

  main() {
    const canvas: any = document.querySelector('#canvas');
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.shadowMap.enabled = true;

    const fov = 75;
    const aspect = 2; // the canvas default
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = true;
    controls.update();

    const scene = new THREE.Scene();
    this.addPlane(scene);

    const light1 = new THREE.DirectionalLight(0xffffff, 0.8);
    light1.position.set(0, 10, 0);
    const light2 = new THREE.DirectionalLight(0xffffff, 1);
    light2.castShadow = true;
    light2.position.set(-5, 4, -5);
    const light3 = new THREE.DirectionalLight(0xffffff, 0.8);
    light3.position.set(10, 4, 10);
    scene.add(light1);
    scene.add(light2);
    scene.add(light3);

    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    function makeCube(geometry, color, x) {
      const material = new THREE.MeshPhongMaterial({ color });

      const cube = new THREE.Mesh(geometry, material);
      cube.castShadow = true;
      cube.receiveShadow = true;
      scene.add(cube);

      cube.position.x = x;

      return cube;
    }

    const cubes = [
      makeCube(geometry, 0x44aa88, 0),
      makeCube(geometry, 'red', 3),
    ];

    // setInterval(() => {
    //   cubes[1].position.x += 0.2;
    //   this.reRender();
    // }, 1000);

    function resizeRenderer(renderer) {
      const canvas = renderer.domElement;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    }

    let renderRequested = false;

    function render() {
      renderRequested = null;

      if (resizeRenderer(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      controls.update();
      renderer.render(scene, camera);
    }
    render();

    function requestRenderIfNotRequested() {
      if (!renderRequested) {
        renderRequested = true;
        requestAnimationFrame(render);
      }
    }

    controls.addEventListener('change', requestRenderIfNotRequested);
    window.addEventListener('resize', requestRenderIfNotRequested);
  }
}
