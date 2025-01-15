import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { colors } from '../properties/colors';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { useEffect } from 'react';
import { KeyController } from './KeyController';
import { Cushion, Lamp, MeshObject, Post } from './MeshObject';
import { Player } from './Player';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { configType } from '../pages/EditPage';

const MyThree: React.FC<{config: configType}> = ({config}) => {
    console.log("setting", config);
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
        renderer.shadowMap.needsUpdate = true;

        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x291455);

        // Camera
        const camera = new THREE.PerspectiveCamera(
            60, // fov
            window.innerWidth / window.innerHeight, // aspect
            0.1, // near
            1000 // far
        );
        camera.position.set(0, 3, 7);
        camera.rotation.set(0, Math.PI* 5/4, 0);
        scene.add(camera);

        //const controls = new OrbitControls(camera, renderer.domElement);
        const gltfLoader = new GLTFLoader();
        const textureLoader = new THREE.TextureLoader();
        const keyController = new KeyController();

        // Light
        const ambientLight = new THREE.AmbientLight('white', 1);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight('white', 100, 100);
        pointLight.castShadow = true;
        // shadow resolution
        pointLight.shadow.mapSize.width = 2048;
        pointLight.shadow.mapSize.height = 2048;
        pointLight.shadow.bias = -0.0001; // Try different small negative values
        pointLight.position.set(0, 10, 0);
        scene.add(pointLight);

        //const helper = new THREE.CameraHelper(pointLight.shadow.camera);
        //scene.add(helper);

        // Sun
        const sunLight = new THREE.PointLight(0xaaffff, 1, 500);
        sunLight.shadow.mapSize.width = 1024;
        sunLight.shadow.mapSize.height = 1024;
        sunLight.shadow.bias = -0.0005; // Adjust for each light
        sunLight.position.set(60, 30, 0);
        scene.add(sunLight);

        // Glow effect
        const glowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                viewVector: {value: new THREE.Vector3()},
                c: {value: 0.5},
                p: {value: 2.0},
            },
            vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float c;
                uniform float p;
                varying vec3 vNormal;
                void main() {
                    float intensity = pow(c - dot(vNormal, vec3(0.0, 0.0, 1.0)), p);
                    gl_FragColor = vec4(1.0, 0.8, 0.4, 1.0) * intensity;
                }
            `,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true,
        });
        
        const glowMesh = new THREE.Mesh(new THREE.SphereGeometry(5, 32, 32), glowMaterial); // Slightly larger sphere
        glowMesh.position.copy(sunLight.position);
        scene.add(glowMesh);

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

        /* Meshes */

        const water = new MeshObject({
            cannonWorld,
            cannonMaterial: defaultCannonMaterial,
            scene,
            name: 'water',
            width: 100,
            height: 0.1,
            depth: 100,
            color: '#5F4F9D',
            y: -0.05,
            offsetY: '0',
        });
        cannonObjects.push(water);

        //const land = new MeshObject({
        //    cannonWorld,
        //    cannonMaterial: defaultCannonMaterial,
        //    scene,
        //    loader: gltfLoader,
        //    name: 'land',
        //    width: 100,
        //    height: 0.1,
        //    depth: 100,
        //    color: '#ba308c',
        //    y: -0.05,
        //    offsetY: '0',
        //    modelSrc: '/land.glb',
        //});
        //cannonObjects.push(land);

        //gltfLoader.load('/land.glb', (glb) => {
        //    glb.scene.traverse((child) => {
        //        const mesh = child as THREE.Mesh;
        //        mesh.castShadow = true;
        //        mesh.receiveShadow = true;
        //    })
        //    glb.scene.name = 'land';
        //    glb.scene.position.y = -0.05;
        //    scene.add(glb.scene)
//
        //    const transparentMesh = new THREE.Mesh(
        //        new THREE.BoxGeometry(100, 0.1, 100),
        //        new THREE.MeshBasicMaterial({
        //            color: 'green',
        //            transparent: true,
        //            opacity: 0,
        //        })
        //    )
        //    transparentMesh.name = 'land';
        //    transparentMesh.position.y = -0.05;
        //    scene.add(transparentMesh);
        //})

        const stage = new MeshObject({
            cannonWorld,
            cannonMaterial: defaultCannonMaterial,
            scene,
            name: 'stage',
            width: 7,
            height: 0.4,
            depth: 7,
            color: 0x999999,
            offsetY: '0',
        });
        cannonObjects.push(stage);

        const floor = new MeshObject({
            cannonWorld,
            cannonMaterial: defaultCannonMaterial,
            scene,
            name: 'floor',
            width: 4.4,
            height: 0.6,
            depth: 4.4,
            color: config.color[0],
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
            color: config.color[0],
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
            color: config.color[0],
            offsetY: '0',
        });
        cannonObjects.push(wallL);

        const table = new MeshObject({
            cannonWorld,
            cannonMaterial: defaultCannonMaterial,
            scene,
            loader: gltfLoader,
            name: 'table',
            width: 0.72,
            height: 0.77,
            depth: 1.3,
            x: 1.45,
            z: 0.4,
            scx: 1.5,
            scz: 1.5,
            modelSrc: '/table.glb'
        });
        cannonObjects.push(table);

        const lamp = new Lamp({
            cannonWorld,
            cannonMaterial: defaultCannonMaterial,
            scene,
            loader: gltfLoader,
            name: 'lamp',
            width: 0.5,
            height: 1.8,
            depth: 0.5,
            x: 1.4,
            z: -1,
            modelSrc: '/lamp.glb',
            callback: () => {
                const lampLight = new THREE.PointLight('#dda6ab', 0, 50);
                lampLight.castShadow = true;
                lampLight.shadow.mapSize.width = 2048;
                lampLight.shadow.mapSize.height = 2048;
                if(lamp.mesh){
                    lampLight.position.y = 0.75;
                    lamp.mesh.add(lampLight);
                }
                lamp.light = lampLight;
            }
        });
        cannonObjects.push(lamp);

        const bookShelf = new MeshObject({
            cannonWorld,
            cannonMaterial: defaultCannonMaterial,
            scene,
            loader: gltfLoader,
            name: 'bookShelf',
            width: 0.34,
            height: 1.8,
            depth: 1.1,
            x: 1.4,
            z: 1.75,
            rotx: 0,
            roty: Math.PI/2,
            rotz: 0,
            scx: 1.2,
            scz: 1.2,
            modelSrc: '/bookShelf.glb'
        });
        cannonObjects.push(bookShelf);

        const board = new MeshObject({
            cannonWorld,
            cannonMaterial: defaultCannonMaterial,
            scene,
            loader: gltfLoader,
            name: 'board',
            width: 2,
            height: 1.2,
            depth: 0.2,
            x: -0.7,
            y: 1.8,
            z: 2,
            roty: Math.PI,
            modelSrc: '/board.glb'
        });
        cannonObjects.push(bookShelf);

        const cushions: Cushion[] = [];
        for(let i=0; i<Math.min(config.stack[0].length, 5); i++){
            console.log(config.stack[0][i]);
            const texture = config.stack[0][i];
            const cushion = new Cushion({
                cannonWorld,
                cannonMaterial: defaultCannonMaterial,
                scene,
                loader: gltfLoader,
                name: `cushion${texture}`,
                x: 1.25 + Math.random() * 0.2,
                y: 1.9 + Math.random() * 0.2,
                z: -0.2 + 0.2 * i,
                rotx: Math.random() * Math.PI/3,
                roty: Math.random() * Math.PI/3,
                mapSrc: `tex_${texture}.png`
            });
            cannonObjects.push(cushion);
            cushions.push(cushion);
        }

        const post1 = new Post({
            cannonWorld,
            cannonMaterial: defaultCannonMaterial,
            scene,
            loader: gltfLoader,
            name: 'post1',
            width: 0.5,
            height: 0.1,
            depth: 0.5,
            x: board.x + 0.5,
            y: board.y,
            z: board.z - 0.1,
            color: 'yellow',
            rotx: -Math.PI/2,
            roty: Math.PI,
            modelSrc: '/post.glb',
            href: config.external_link1[0]
        });
        cannonObjects.push(post1);

        const post2 = new Post({
            cannonWorld,
            cannonMaterial: defaultCannonMaterial,
            scene,
            loader: gltfLoader,
            name: 'post2',
            width: 0.5,
            height: 0.1,
            depth: 0.5,
            x: board.x - 0.5,
            y: board.y,
            z: board.z - 0.1,
            color: 'yellow',
            rotx: -Math.PI/2,
            roty: Math.PI,
            modelSrc: '/post.glb',
            href: config.external_link2[0]
        });
        cannonObjects.push(post2);

        const player = new Player({
            scene,
            name: 'you',
            cannonWorld,
            cannonMaterial: playerCannonMaterial,
            mass: 50,
            x: -0.5,
            z: -0.5,
        });

        /* Texts */

        const refSpriteMaterial = new THREE.SpriteMaterial({
            map: createTextTexture('둘러보기', 24),
        });
        const refsprite = new THREE.Sprite(refSpriteMaterial);
        refsprite.scale.set(1, 0.5, 0.5); // Adjust size
        refsprite.position.set(board.x, board.y + 0.5, board.z-0.5); // Position in 3D space
        scene.add(refsprite);

        const stackSpriteMaterial = new THREE.SpriteMaterial({
            map: createTextTexture('나의 기술스택', 24),
        });
        const stacksprite = new THREE.Sprite(stackSpriteMaterial);
        stacksprite.scale.set(1, 0.5, 0.5); // Adjust size
        stacksprite.position.set(table.x, table.y + 1.5, table.z); // Position in 3D space
        scene.add(stacksprite);
        
        // Helper to create text canvas
        function createTextTexture(text: string, fontSize: number, scalex=300, scaley=128, color?: string) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = scalex;
            canvas.height = scaley;
            ctx!.fillStyle = color || 'white';
            ctx!.font = `${fontSize}px Pretendard`;
            ctx!.textAlign = 'center';
            ctx!.textBaseline = 'middle';
            ctx!.fillText(text, canvas.width / 2, canvas.height / 2);

            const texture = new THREE.CanvasTexture(canvas);
            texture.minFilter = THREE.LinearFilter;
            return texture;
        }

        // hover caption
        const captions: THREE.Sprite[] = [];
        const stackNames = config.stack[0];
        for(let i = 0; i < stackNames.length; i++){
            captions[i] = createCaption(stackNames[i]);
            scene.add(captions[i]);
        }

        function createCaption(text: string) {
            const captionSpriteMaterial = new THREE.SpriteMaterial({
                map: createTextTexture(text, 20, 200, 200),
                transparent: true,
            });
            const captionsprite = new THREE.Sprite(captionSpriteMaterial);
            captionsprite.scale.set(1, 0.5, 0.5); // Adjust size
            captionsprite.visible = false;

            return captionsprite;
        }

        // fixed text
        const linkTexture1 = createTextTexture(config.external_link1, 16, 200, 200, 'black');
        const linkTexture2 = createTextTexture(config.external_link2, 16, 200, 200, 'black');

        const linkPlaneGeometry = new THREE.PlaneGeometry(0.5, 0.5); // Adjust width and height

        const linkPlaneMaterial1 = new THREE.MeshBasicMaterial({
            map: linkTexture1,
            transparent: true,
        });
        const linkTextPlane1 = new THREE.Mesh(linkPlaneGeometry, linkPlaneMaterial1);

        const linkPlaneMaterial2 = new THREE.MeshBasicMaterial({
            map: linkTexture2,
            transparent: true,
        });
        const linkTextPlane2 = new THREE.Mesh(linkPlaneGeometry, linkPlaneMaterial2);

        linkTextPlane1.position.set(post1.x, post1.y, post1.z-0.08); // Adjust as needed
        linkTextPlane1.rotation.set(0, Math.PI, 0); // Keep it static in the scene
        linkTextPlane2.position.set(post2.x, post2.y, post2.z-0.08); // Adjust as needed
        linkTextPlane2.rotation.set(0, Math.PI, 0); // Keep it static in the scene

        scene.add(linkTextPlane1, linkTextPlane2);
        
        /* Functions */

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
            if (keyController.keys['Space'] && !player.isJumping){
                player.jump();
            }
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
        let hoveredObject: THREE.Object3D | null;
        function checkIntersects(mode: string) {
            raycaster.setFromCamera(mouse, camera);
            // children items that are hit by the ray
            const intersects = raycaster.intersectObjects(scene.children)
            
            if (intersects.length > 0) {
                const selectedObject = intersects[0].object;
                if (mode === "clicked") {
                    console.log(selectedObject.name);
                    for (const item of intersects) {
                        if (item.object.name === 'post1') {
                            post1.togglePower();
                            break;
                        }
                        if (item.object.name === 'post2') {
                            post2.togglePower();
                            break;
                        }
                        if (item.object.name === 'lamp'){
                            lamp.togglePower();
                            break;
                        }
                    }
                } else if (hoveredObject !== selectedObject) {
                    hoveredObject = selectedObject;
                    for (let i=0; i<5; i++){
                        if (selectedObject.name === `cushion${config.stack[0][i]}`){
                            captions[i].position.copy(table.mesh.position).add(new THREE.Vector3(0, 0.8, 0));
                            captions[i].rotation.y = Math.PI / 6;
                            captions[i].visible = true;
                            console.log(hoveredObject.name, hoveredObject.position)
                        } else {
                            captions[i].visible = false;
                        }
                    }
                }
            } else {
                hoveredObject = null;
                captions.map((caption) => { caption.visible = false; });
            }
        }
        
        // Draw
        let movementX = 0;
        let movementY = 0;
        let delta: number;
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

                if (player.cannonBody.velocity.y === 0) {
                    player.isJumping = false; // Reset jumping state
                }
            
                move()
            }

            if (player.cannonBody.velocity.y === 0) { player.isJumping = false; }
        
            moveCamera();
            renderer.render(scene, camera);
            renderer.setAnimationLoop(draw);
        }
        
        draw();
        
        // Events
        function updateMovementValue(event: MouseEvent) {
            movementX = event.movementX * delta /2;
            movementY = event.movementY * delta /2;

            mouse.x = 0;
            mouse.y = 0;

            if(document.body.dataset.mode === 'game'){
                checkIntersects("hovered");
            }
        }

        const raycastIntersectHandler = () => {
            mouse.x = 0;
            mouse.y = 0;
            if(document.body.dataset.mode === 'game'){
                checkIntersects("clicked");
            }
        }

        const pointerlockChangeHandler = () => {
            if(document.pointerLockElement === canvas){
                setMode('game') // <body data-mode="game">
            } else {
                setMode('website') // <body data-mode="website">
            }
        }

        window.addEventListener('resize', setLayout);
        
        window.addEventListener('click', () => {
            canvas.requestPointerLock(); // hiding pointer curosr
        });
        
        canvas.addEventListener('click', raycastIntersectHandler);
        
        document.addEventListener('pointerlockchange', pointerlockChangeHandler)

        return (() => {
            window.removeEventListener('resize', setLayout);
            window.removeEventListener('click', () => canvas.requestPointerLock());
            canvas.removeEventListener('click', raycastIntersectHandler);
            document.removeEventListener('pointerlockchange', pointerlockChangeHandler);
        })
    }, []);

    return null;
}

export default MyThree;
