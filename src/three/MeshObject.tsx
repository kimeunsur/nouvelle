import { Body, Box, Quaternion, Vec3 } from "cannon-es"
import { BoxGeometry,
         Group,
         Light,
         Mesh,
         MeshBasicMaterial,
         MeshLambertMaterial,
         Object3D,
         PointLight,
         Texture, 
         TextureLoader,
         TorusGeometry} from "three"
import { GLTF, GLTFLoader } from "three/examples/jsm/Addons"

export class MeshObject {
    name: string
    width: number
    height: number
    depth: number
    color: string
    offsetY: number
    x: number
    y: number
    z: number
    rotx: number
    roty: number
    rotz: number
    scx: number
    scy: number
    scz: number
    mass: number
    cannonShape
    cannonWorld
    cannonMaterial
    cannonBody: any
    mesh: Object3D | Group
    transparentMesh: any

    constructor(info: any) {
        this.name = info.name;
        this.width = info.width || 1;
        this.height = info.height || 1;
        this.depth = info.depth || 1;
        this.color = info.color || 'white';
        this.offsetY = info.offsetY || 0.6;
        this.x = (info.x || 0) * 1;
        this.y = (info.y || this.height / 2 + this.offsetY) * 1;
        this.z = (info.z || 0) * 1;
        this.rotx = info.rotx || 0;
        this.roty = info.roty || 0;
        this.rotz = info.rotz || 0;
        this.scx = info.scx || 1;
        this.scy = info.scy || 1;
        this.scz = info.scz || 1;

        this.cannonShape = info.cannonShape || new Box(new Vec3(this.width/2, this.height/2, this.depth/2));

        this.mass = info.mass || 0;
        this.cannonWorld = info.cannonWorld;
        this.cannonMaterial = info.cannonMaterial;
        this.mesh = new Mesh();

        if(info.modelSrc) {
            info.loader.load(
                info.modelSrc,
                (glb: GLTF) => {
                    glb.scene.traverse((child) => {
                        if((child as Mesh).isMesh) {
                            const mesh = child as Mesh;
                            mesh.castShadow = true;
                            const texture = info.mapSrc? new TextureLoader().load(info.mapSrc) : null;
                            
                            mesh.material = new MeshLambertMaterial({
                                color: texture? "white" : this.color,
                                map: texture || (mesh.material as MeshLambertMaterial).map,
                            })
                            child.name = this.name;
                            
                            if (child.castShadow) {
                                console.log(`Shadow caster: ${child.name}`);
                            }
                            
                        }
                    })
                    this.mesh = glb.scene as Group;
                    this.mesh.castShadow = true;
                    glb.scene.name = this.name;
                    glb.scene.position.set(this.x, this.y, this.z);
                    glb.scene.rotation.set(this.rotx, this.roty, this.rotz);
                    glb.scene.scale.set(this.scx, this.scy, this.scz);
                    info.scene.add(this.mesh);

                    // transparent mesh for raycasting
                    const geometry = info.geometry || new BoxGeometry(this.width, this.height, this.depth);
                    this.transparentMesh = new Mesh(
                        geometry,
                        new MeshBasicMaterial({
                            color: 'green',
                            transparent: true,
                            opacity: 0,
                        })
                    );
                    this.transparentMesh.name = this.name+" coll";
                    this.transparentMesh.position.set(this.x, this.y, this.z);
                    this.transparentMesh.rotation.set(this.rotx, this.roty, this.rotz);
                    this.transparentMesh.scale.set(this.scx, this.scy, this.scz);
                    info.scene.add(this.transparentMesh);

                    this.setCannonBody();

                    // callback func
                    if (info.callback) info.callback();
                },
                (xhr: any) => { // function while loading
                    //console.log('loading...');
                },
                (error: any) => { // function when error
                    //console.log('server');
                }
            )
        } else if (info.mapSrc) {
            const geometry = new BoxGeometry(this.width, this.height, this.depth);
            info.loader.load(
                info.mapSrc,
                (texture: Texture) => {
                    const material = new MeshLambertMaterial({
                        map: texture
                    });
                    this.mesh = new Mesh(geometry, material);
                    this.mesh.name = this.name;
                    this.mesh.position.set(this.x, this.y, this.z);
                    this.mesh.rotation.set(this.rotx, this.roty, this.rotz);
                    info.scene.add(this.mesh);

                    this.setCannonBody()
                }
            )
        } else {

            const geometry = new BoxGeometry(this.width, this.height, this.depth)
            const material = new MeshLambertMaterial({
                color: this.color,
            });

            this.mesh = new Mesh(geometry, material);
            this.mesh.name = this.name;
            this.mesh.castShadow = true;
            this.mesh.receiveShadow = true;
            this.mesh.position.set(this.x, this.y, this.z);
            this.mesh.rotation.set(this.rotx, this.roty, this.rotz);
            info.scene.add(this.mesh);

            this.setCannonBody()
        }
    }

    setCannonBody() {
        this.cannonBody = new Body({
            mass: this.mass, // if fixed, mass = 0
            position: new Vec3(this.x, this.y, this.z),
            shape: this.cannonShape,
            material: this.cannonMaterial
        })

        // initial rotation
        // rotation along X
        const quatX = new Quaternion();
        const axisX = new Vec3(1, 0, 0);
        quatX.setFromAxisAngle(axisX, this.rotx);

        // rotation along Y
        const quatY = new Quaternion();
        const axisY = new Vec3(0, 1, 0);
        quatY.setFromAxisAngle(axisY, this.roty);

        // rotation along Z
        const quatZ = new Quaternion();
        const axisZ = new Vec3(0, 0, 1);
        quatZ.setFromAxisAngle(axisZ, this.rotz);

        const combineQuat = quatX.mult(quatY).mult(quatZ)
        this.cannonBody.quaternion = combineQuat;

        this.cannonWorld.addBody(this.cannonBody)
    }
}

export class Lamp extends MeshObject {
    light: PointLight
    constructor (info: any) {
        super(info);
        this.light = new PointLight('#0ea6ab', 0, 50);
    }

    togglePower() {
        if (this.light.intensity === 0) {
            this.light.intensity = 7;
        } else {
            this.light.intensity = 0;
        }
    }
}

export class Cushion extends MeshObject {
    constructor(info: any) {
        const defaultCushionInfo = {
            geometry: new TorusGeometry(0.12, 0.05, 5, 10),
            mass: 10,
            width: 0.37,
            height: 0.37,
            depth: 0.1,
            modelSrc: '/cushion.glb',
        };
        const cushionInfo = { ...defaultCushionInfo, ...info };

        super(cushionInfo);
    }
}

export class Post extends MeshObject {
    href: string
    constructor (info: any) {
        super(info);
        this.href = info.href;
    }

    togglePower() {
        window.open(this.href, "_blank");
    }
}