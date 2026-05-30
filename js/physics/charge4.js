import { Charge } from "./charge.js";
import { Vector3 } from "./vector3.js";
import { Vector4 } from "./vector4.js";

class Charge4 extends Charge {
    /**
     * 
     * @param {Vector4} posWithTime 
     * @param {Number} mass 
     * @param {Number} charge 
     * @param {Vector4} velocityAtTime 
     * @param {Vector4} accAtTime 
     * 
     */
    constructor(posWithTime, mass, charge, velocityAtTime, accAtTime) {
        super();
        this.pos = posWithTime;
        this.m = mass;
        this.q = charge;
        this.v = velocityAtTime;
        this.a = accAtTime;
        //this.parametricCurve = curve;
        /*if (curve) {
            this.pastPos = [
                pos
            ]
        }*/
        this.pastPos = {};
        Charge.all.push(this);
        
    }
    changePos(newPos) {
        this.pastPos[`${this.pos.t}`] = new Vector3(this.pos.x, this.pos.y, this.pos.z);
        this.pos = newPos;
    }
}

export {Charge4}