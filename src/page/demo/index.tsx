/*
 * @Author: wxy
 * @Description:
 * @Date: 2023-03-31 12:05:56
 * @LastEditTime: 2023-04-03 20:01:42
 */
/*
 * @Author: wxy
 * @Description:
 * @Date: 2023-03-13 19:14:40
 * @LastEditTime: 2023-03-31 13:31:16
 */
import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  CSS3DObject,
  CSS3DRenderer,
} from "three/examples/jsm/renderers/CSS3DRenderer";

let css3DObject: any = null;
let labelRenderer: any = null;
let camera: any = null;
let scene: any = null;
let renderer: any = null;
let controls: any = null;

const Demo = () => {
  const [data, setData] = useState("");

  useEffect(() => {
    initContainer();
  }, []);

  // 初始化渲染器
  const initRenderer = () => {
    const container = document.getElementById("container");

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = false;
    // renderer.setClearColor("#ffffff", 1);
    renderer.shadowMap.enabled = true;
    container?.appendChild(renderer.domElement);

    labelRenderer = new CSS3DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = "absolute";
    labelRenderer.domElement.style.top = "0px";
    container?.appendChild(labelRenderer.domElement);
    // labelRenderer.domElement.addEventListener("click", onMouseClick);
  };

  // 初始化相机
  const initCamera = () => {
    camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      100000
    );
    camera.position.set(0, 400, 5000);
    camera.lookAt(0, 1, 0);
  };

  // 初始化场景
  const initScene = () => {
    scene = new THREE.Scene();
  };

  // 初始化光源
  const initLight = () => {
    // 环境光
    scene.add(new THREE.AmbientLight("#9d9ea1", 4));

    // 平行光
    const dirLight = new THREE.DirectionalLight("red");
    dirLight.position.set(180, 80, 100);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 2;
    dirLight.shadow.camera.bottom = -2;
    dirLight.shadow.camera.left = -2;
    dirLight.shadow.camera.right = 2;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 40;
    scene.add(dirLight);
  };

  const initOrbitControls = () => {
    controls = new OrbitControls(camera, labelRenderer.domElement);
    controls?.update();
  };

  const initFbxModel = () => {
    const arr = ["对象556"];
    const gltfLoader = new GLTFLoader();

    gltfLoader.load(
      "./model/building.glb",
      (gltf) => {
        gltf.scene.traverse((child) => {
          console.log(child.userData.name);
          if (arr.indexOf(child.userData.name) != -1) {
            const css3dObject = createTag(child);
            console.log(css3dObject, child);
            gltf.scene.add(css3dObject);
          }
        });
        scene.add(gltf.scene);
      },
      onProgress,
      onError
    );
    // const loader = new FBXLoader();
    // loader.load(
    //   "model/untitled.fbx",
    //   (object) => {
    //     object.traverse(function (child) {
    //         console.log(child);
    //       if (child.isMesh) {
    //         child.castShadow = true;
    //         child.receiveShadow = true;
    //       }
    //       if (arr.indexOf(child.name) != -1) {
    //         const css3dObject = createTag(child);
    //         scene.add(css3dObject);
    //       }
    //     });
    //     object.scale.multiplyScalar(0.1);
    //     scene.add(object);
    //   },
    //   onProgress,
    //   onError
    // );
  };

  const initContainer = () => {
    initRenderer();
    initCamera();
    initScene();
    initLight();
    initOrbitControls();
    initFbxModel();
    // addCSS3DLabelToScene();
    animate();
  };

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    labelRenderer?.render(scene, camera);
    renderer?.render(scene, camera);
  }
  const addCSS3DLabelToScene = () => {
    const element = document.getElementById("div");
    css3DObject = new CSS3DObject(element);
    //设置CSS3DObject对象
    css3DObject.position.x = 0;
    css3DObject.position.y = 0;
    css3DObject.position.z = 0;
    //在第二个场景中添加这个对象
    scene.add(css3DObject);
    // 默认不显示
    css3DObject.visible = false;
  };

  const createTag = (object3d) => {
    // 创建各个区域的元素标签
    const element = document.createElement("div");
    element.className = "elementTag";
    element.innerHTML = `
      <div class="elementContent">
        <h3>${object3d.name}</h3>
        <p>温度：26℃</p>
        <p>湿度：50%</p>
      </div>
    `;

    const objectCSS3D = new CSS3DObject(element);
    objectCSS3D.position.copy(object3d.position);
    objectCSS3D.scale.set(0.2, 0.2, 0.2);
    return objectCSS3D;
  };

  const onMouseClick = (event) => {
    const raycaster = new THREE.Raycaster(); // 初始化光线追踪
    const vector = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
    raycaster.setFromCamera(vector, camera);
    const intersects = raycaster.intersectObjects(scene.children, true); // 获取点击到的模型的数组，从近到远排列
    if (intersects.length) {
      css3DObject.visible = true;
      css3DObject.position.x = intersects[0].point.x;
      css3DObject.position.y = intersects[0].point.y;
      console.log(intersects[0].object);
      intersects[0].object.material = new THREE.MeshPhongMaterial({
        color: 0xff0000,
      });
      setData(intersects[0].object.name);
    } else {
      css3DObject.visible = false;
    }
  };

  const onProgress = (xhr) => {
    if (xhr.lengthComputable) {
      const percentComplete = (xhr.loaded / xhr.total) * 100;
      //   console.log(Math.round(percentComplete, 2) + "% downloaded");
    }
  };

  const onError = (xhr) => {
    console.error(xhr);
  };

  return (
    <>
      <div id="container"></div>
      <div id="div">{data}</div>
    </>
  );
};

export default Demo;
