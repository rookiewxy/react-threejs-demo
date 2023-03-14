import React, { useEffect } from 'react';
import * as THREE from 'three'
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

const Demo = () => {

    useEffect(() => {
        initContainer()
    }, [])

    const initContainer = () => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        const container = document.getElementById("container")
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        container?.appendChild(renderer.domElement);

        // 环境光
        scene.add(new THREE.AmbientLight(4210752, 3));
        // 平行光
        var light = new THREE.DirectionalLight(16777215, 1);
        light.position.set(0, 50, 50);
        scene.add(light);
        camera.position.z = 300;
        camera.position.y = 10;


        const loader = new FBXLoader()
        loader.load('model/demo.fbx', (object) => {
            object.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }

            });
            object.scale.multiplyScalar(.1);
            object.position.set(0,0,10)
            scene.add(object);

        animate();
        }, onProgress, onError)


        function animate() {
            requestAnimationFrame( animate );
            renderer.render( scene, camera );
        }

    }

    function onProgress(xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };

    function onError(xhr) {
        console.error(xhr);
    };


    return <div id="container"></div>
}

export default Demo