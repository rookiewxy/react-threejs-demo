/*
 * @Author: wxy
 * @Description:
 * @Date: 2023-03-13 19:14:40
 * @LastEditTime: 2023-03-15 19:05:07
 */
import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
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
const cameraPos = new THREE.Vector3(0, 900, 1500);

const Demo = () => {
  const [data, setData] = useState("");
  useEffect(() => {
    initContainer();
  }, []);

  const initContainer = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      100,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    camera.lookAt(scene.position);

    // 环境光
    scene.add(new THREE.AmbientLight("#494b52", 4));
    // 平行光
    const light = new THREE.DirectionalLight(16777215, 1);
    scene.add(light);

    camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);

    const container = document.getElementById("container");

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container?.appendChild(renderer.domElement);

    labelRenderer = new CSS3DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = "absolute";
    labelRenderer.domElement.style.top = "0px";
    container?.appendChild(labelRenderer.domElement);

    const controls = new OrbitControls(camera, labelRenderer.domElement);
    controls?.update();

    const loader = new FBXLoader();
    loader.load(
      "model/a.fbx",
      (object) => {
        object.traverse(function (child) {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        object.scale.multiplyScalar(0.1);
        scene.add(object);
      },
      onProgress,
      onError
    );

    addCSS3DLabelToScene();
    labelRenderer.domElement.addEventListener("click", onMouseClick);

    animate();
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      labelRenderer?.render(scene, camera);
      renderer?.render(scene, camera);
    }
  };

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
      css3DObject.position.z = intersects[0].point.z;
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
