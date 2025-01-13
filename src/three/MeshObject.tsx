import { Body, Box, Quaternion, Vec3 } from "cannon-es"
import { BoxGeometry, Mesh, MeshBasicMaterial, MeshLambertMaterial, Texture } from "three"
import { GLTF } from "three/examples/jsm/Addons"

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
    mass: number
    cannonShape
    cannonWorld
    cannonMaterial
    cannonBody: any
    mesh
    transparentMesh: any

    constructor(info: any) {
        this.name = info.name;
        this.width = info.width || 1;
        this.height = info.height || 1;
        this.depth = info.depth || 1;
        this.color = info.color || 'white';
        this.offsetY = info.offsetY || 0.4;
        this.x = (info.x || 0) * 1;
        this.y = (info.y || this.height / 2 + this.offsetY) * 1;
        this.z = (info.z || 0) * 1;
        this.rotx = info.rotx || 0;
        this.roty = info.roty || 0;
        this.rotz = info.rotz || 0;

        this.cannonShape = info.cannonShape || new Box(new Vec3(this.width/2, this.height/2, this.depth/2));

        this.mass = info.mass || 0;
        this.cannonWorld = info.cannonWorld;
        this.cannonMaterial = info.cannonMaterial;

        if(info.modelSrc) {
            info.loader.load(
                info.modelSrc,
                (glb: any) => {
                    glb.scene.traverse((child: any) => {
                        if(child.isMesh) {
                            child.castShadow = true;
                        }
                    })
                    this.mesh = glb.scene;
                    this.mesh!.name = this.name;
                    this.mesh!.position.set(this.x, this.y, this.z);
                    this.mesh!.rotation.set(this.rotx, this.roty, this.rotz);
                    info.scene.add(this.mesh);

                    // transparent mesh for raycasting
                    const geometry = info.geometry || new BoxGeometry(this.width, this.height, this.depth);
                    this.transparentMesh = new Mesh(
                        geometry,
                        new MeshBasicMaterial({
                            color: 'green',
                            transparent: true,
                            opacity: 0.5,
                        })
                    );
                    this.transparentMesh.name = this.name;
                    this.transparentMesh.position.set(this.x, this.y, this.z)
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
        const axisY = new Vec3(1, 0, 0);
        quatY.setFromAxisAngle(axisY, this.roty);

        // rotation along Z
        const quatZ = new Quaternion();
        const axisZ = new Vec3(1, 0, 0);
        quatZ.setFromAxisAngle(axisZ, this.rotz);

        const combineQuat = quatX.mult(quatY).mult(quatZ)
        this.cannonBody.quaternion = combineQuat;

        this.cannonWorld.addBody(this.cannonBody)
    }
}