import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { colors } from '../properties/colors';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { useEffect } from 'react';
import { KeyController } from './KeyController';
import { MeshObject } from './MeshObject';
import { Player } from './Player';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

const MyThree = () => {
    useEffect(() => {
        const canvas = document.getElementById('myRoom') as HTMLCanvasElement;

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2: 1);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(colors.navyDark);

        // Camera
        const camera = new THREE.PerspectiveCamera(
            60, // fov
            window.innerWidth / window.innerHeight, // aspect
            0.1, // near
            1000 // far
        );
        camera.position.set(0, 3, 7);
        camera.rotation.set(0, Math.PI * 5/4, 0);
        scene.add(camera);

        //const controls = new OrbitControls(camera, renderer.domElement);
        const gltfLoader = new GLTFLoader();
        const textureLoader = new THREE.TextureLoader();
        const keyController = new KeyController();

        // Light
        const ambientLight = new THREE.AmbientLight('white', 1);
        const pointLight = new THREE.PointLight('white', 100, 100);
        pointLight.castShadow = true;
        // shadow resolution
        pointLight.shadow.mapSize.width = 2048;
        pointLight.shadow.mapSize.height = 2048;
        pointLight.position.set(0, 10, 0);
        scene.add(ambientLight, pointLight);

        // Cannon(Physics)
        const cannonWorld = new CANNON.World();
        cannonWorld.gravity.set(0, -10, 0); // g = 9.8

        // material name
        const defaultCannonMaterial = new CANNON.Material('default');
        const playerCannonMaterial = new CANNON.Material('player');
        const defaultContactMaterial = new CANNON.ContactMaterial(
            defaultCannonMaterial, // colliding obj1
            defaultCannonMaterial, // colliding obj2
            {
                friction: 1,
                restitution: 0.2
            }
        );
        const playerContactMaterial = new CANNON.ContactMaterial(
            playerCannonMaterial, // colliding obj1
            defaultCannonMaterial, // colliding obj2
            {
                
                friction: 100,
                restitution: 0,
            }
        );
        cannonWorld.addContactMaterial(playerContactMaterial);
        cannonWorld.defaultContactMaterial = defaultContactMaterial;

        const cannonObjects: MeshObject[] = [];

        const ground = new MeshObject({
            cannonWorld,
            cannonMaterial: defaultCannonMaterial,
            scene,
            name: 'ground',
            width: 50,
            height: 0.1,
            depth: 50,
            color: '#092e66',
            y: -0.05,
            offsetY: '0',
        });
        cannonObjects.push(ground);

        const stage = new MeshObject({
            cannonWorld,
            cannonMaterial: defaultCannonMaterial,
            scene,
            name: 'stage',
            width: 5,
            height: 0.1,
            depth: 5,
            color: 0xdddddd,
            offsetY: '0',
        });
        cannonObjects.push(stage);

        const floor = new MeshObject({
            cannonWorld,
            cannonMaterial: defaultCannonMaterial,
            scene,
            name: 'floor',
            width: 4.4,
            height: 0.2,
            depth: 4.4,
            color: colors.gray,
            offsetY: '0',
        });
        cannonObjects.push(floor);

        const wallR = new MeshObject({
            cannonWorld,
            cannonMaterial: defaultCannonMaterial,
            scene,
            name: 'wallR',
            width: 4.4,
            height: 3.8,
            depth: 0.2,
            y: 2.1,
            z: 2.1,
            color: colors.gray,
            offsetY: '0',
        });
        cannonObjects.push(wallR);

        const wallL = new MeshObject({
            cannonWorld,
            cannonMaterial: defaultCannonMaterial,
            scene,
            name: 'wallL',
            width: 0.2,
            height: 3.8,
            depth: 4.4,
            x: 2.1,
            y: 2.1,
            color: colors.gray,
            offsetY: '0',
        });
        cannonObjects.push(wallL);

        const table = new MeshObject({
            cannonWorld,
            cannonMaterial: defaultCannonMaterial,
            mass: 20,
            scene,
            loader: gltfLoader,
            name: 'table',
            width: 0.72,
            height: 0.77,
            depth: 1.3,
            x: 1.5,
            y: 1,
            z: 0,
            modelSrc: '/table.glb'
        })
        cannonObjects.push(table);

        const lamp = new MeshObject({
            cannonWorld,
            cannonMaterial: defaultCannonMaterial,
            mass: 20,
            scene,
            loader: gltfLoader,
            name: 'lamp',
            width: 0.5,
            height: 1.8,
            depth: 0.5,
            x: 1.5,
            z: 1.5,
            modelSrc: '/lamp.glb'
        })
        cannonObjects.push(lamp);

        const bookShelf = new MeshObject({
            cannonWorld,
            cannonMaterial: defaultCannonMaterial,
            mass: 100,
            scene,
            loader: gltfLoader,
            name: 'bookShelf',
            width: 0.34,
            height: 1.8,
            depth: 1.1,
            x: 0,
            y: 1,
            z: 1.5,
            rotx: 0,
            roty: Math.PI/2,
            rotz: 0,
            modelSrc: '/bookShelf.glb'
        })
        cannonObjects.push(bookShelf);

        const cushion = new MeshObject({
            cannonWorld,
            cannonMaterial: defaultCannonMaterial,
            mass: 10,
            scene,
            loader: gltfLoader,
            name: 'cushion',
            width: 0.37,
            height: 0.37,
            depth: 0.1,
            x: 0.1,
            y: 1,
            z: 0.3,
            modelSrc: '/cushion.glb'
        })
        cannonObjects.push(cushion);

        const player = new Player({
            scene,
            name: 'you',
            cannonWorld,
            cannonMaterial: playerCannonMaterial,
            mass: 50,
            x: -2,
            z: -2,
        });
        
        // Functions
        function setLayout() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
        
        function move() {
            if (keyController.keys['KeyW'] || keyController.keys["ArrowUp"]){
                player.walk(-0.05, 'forward', scene);
            }
            if (keyController.keys['KeyS'] || keyController.keys["ArrowDown"]){
                player.walk(0.05, 'backward', scene);
            }
            if (keyController.keys['KeyA'] || keyController.keys["ArrowLeft"]){
                player.walk(0.05, 'left', scene);
            }
            if (keyController.keys['KeyD'] || keyController.keys["ArrowRight"]){
                player.walk(0.05, 'right', scene);
            }
            if (keyController.keys['Space'] || !player.isJumping){
                player.jump();
            }
        }
        let movementX = 0;
        let movementY = 0;
        let delta: number;
        function updateMovementValue(event: any) {
            movementX = event.movementX * delta;
            movementY = event.movementY * delta; 
        }
        
        const euler = new THREE.Euler(0, 0, 0, 'YXZ');
        const minPolarAngle = 0;
        const maxPolarAngle = Math.PI; // 180
        function moveCamera() {
            // rotation
            euler.setFromQuaternion(camera.quaternion);
            euler.y -= movementX;
            euler.x -= movementY;
            euler.x = Math.max(Math.PI/2 - maxPolarAngle, Math.min(Math.PI/2 - minPolarAngle, euler.x));
        
            movementX -= movementX * 0.2;
            movementY -= movementY * 0.2;
            if (Math.abs(movementX) < 0.1) movementX = 0;
            if (Math.abs(movementY) < 0.1) movementY = 0;
            
            camera.quaternion.setFromEuler(euler)
            // apply camera direction to the player direction
            player.roty = euler.y;
        
            // position
            camera.position.x = player.x;
            camera.position.y = player.y + 1;
            camera.position.z = player.z;
        }
        
        function setMode(mode: string) {
            document.body.dataset.mode = mode;
        
            if (mode === 'game') {
                document.addEventListener('mousemove', updateMovementValue);
            } else if (mode === 'website') {
                document.removeEventListener('mousemove', updateMovementValue);
            }
        }
        
        // Raycasting
        const mouse = new THREE.Vector2();
        const raycaster = new THREE.Raycaster();
        function checkIntersects() {
            raycaster.setFromCamera(mouse, camera);
            // children items that are hit by the ray
            const intersects = raycaster.intersectObjects(scene.children)
            for (const item of intersects) {
                console.log(item.object.name);
                if (item.object.name === 'lamp') {
                    break;
                }
            }
        }
        
        // Draw
        const clock = new THREE.Clock(); // fot delta = time Wper frame (resolving fps difference)
        function draw() {
            delta = clock.getDelta();
        
            let cannonStepTime = 1/60;
            if (delta < 0.01) cannonStepTime = 1/120;
            cannonWorld.step(cannonStepTime, delta, 3)
        
            // update objects' transforms
            for (const object of cannonObjects){
                if(object.cannonBody) {
                    object.mesh!.position.copy(object.cannonBody.position);
                    object.mesh!.quaternion.copy(object.cannonBody.quaternion);
        
                    if(object.transparentMesh) {
                        object.transparentMesh.position.copy(object.cannonBody.position);
                        object.transparentMesh.quaternion.copy(object.cannonBody.quaternion);
                    }
                }
            }
            
            /* player */
            if (player.cannonBody){
                // update player's position
                player.mesh.position.copy(player.cannonBody.position);
                player.x = player.cannonBody.position.x;
                player.y = player.cannonBody.position.y;
                player.z = player.cannonBody.position.z;
                move()
            }

            if (player.cannonBody.velocity.y === 0) { player.isJumping = false; }
        
            moveCamera();
            renderer.render(scene, camera);
            renderer.setAnimationLoop(draw);
        }
        
        draw();
        
        // Events
        window.addEventListener('resize', setLayout);
        
        window.addEventListener('click', () => {
            canvas.requestPointerLock(); // hiding pointer curosr
        });
        
        canvas.addEventListener('click', event => {
            mouse.x = 0;
            mouse.y = 0;
            if(document.body.dataset.mode === 'game'){
                checkIntersects();
            }
        })
        
        document.addEventListener('pointerlockchange', () => {
            if(document.pointerLockElement === canvas){
                setMode('game') // <body data-mode="game">
            } else {
                setMode('website') // <body data-mode="website">
            }
        })
    }, []);

    return null;
}

export default MyThree;
