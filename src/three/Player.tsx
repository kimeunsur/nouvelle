import { EventType } from "@testing-library/react"
import { Body, Box, Quaternion, Vec3 } from "cannon-es"
import { BoxGeometry, Mesh, MeshLambertMaterial, Scene, Vector3 } from "three"
import { Raycaster } from "three"

export class Player {
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
    cannonWorld
    cannonMaterial
    cannonBody: any
    mesh
    transparentMesh: any
    isJumping: boolean

    constructor(info: any) {
        this.name = info.name;
        this.width = info.width || 1;
        this.height = info.height || 1;
        this.depth = info.depth || 1;
        this.color = info.color || 'white';
        this.offsetY = info.offsetY || 0.4;
        this.x = (info.x || 0) * 1;
        this.y = (info.y || 0) * 1 + this.height / 2 + this.offsetY;
        this.z = (info.z || 0) * 1;
        this.rotx = info.rotx || 0;
        this.roty = info.roty || 0;
        this.rotz = info.rotz || 0;

        this.mass = info.mass || 0;
        this.cannonWorld = info.cannonWorld;
        this.cannonMaterial = info.cannonMaterial;

        const geometry = new BoxGeometry(this.width, this.height, this.depth)
        const material = new MeshLambertMaterial({
            transparent: true,
            opacity: 0,
        });

        this.mesh = new Mesh(geometry, material);
        this.mesh.position.set(this.x, this.y, this.z);
        this.mesh.rotation.set(this.rotx, this.roty, this.rotz);
        info.scene.add(this.mesh);

        this.isJumping = false;

        this.setCannonBody()
    }

    walk(value: number, direction: string, scene: any) {
        if (direction === 'left'){ // -90 deg
            this.roty -= Math.PI / 2;
        }
        if (direction === 'right'){ // +90 deg
            this.roty += Math.PI / 2;
        }
        
        this.x += Math.sin(this.roty) * value;
        this.z += Math.cos(this.roty) * value;
        if (this.cannonBody) {
            this.cannonBody.position.x = this.x;
            this.cannonBody.position.y = this.y;
            this.cannonBody.position.z = this.z;
            this.mesh.position.x = this.x;
            this.mesh.position.y = this.y;
            this.mesh.position.z = this.z;
        }
    }

    jump() {
        this.isJumping = true;
        this.cannonBody.velocity.y = 5;
    }

    setCannonBody() {
        this.cannonBody = new Body({
            mass: this.mass, // if fixed, mass = 0
            position: new Vec3(this.x, this.y, this.z),
            shape: new Box(new Vec3(this.width/2, this.height/2, this.depth/2)),
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