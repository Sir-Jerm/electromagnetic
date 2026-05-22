import { drawCircle, canvas } from "../misc/ctx.js";
import { Vector3 } from "./vector3.js";
import { rotatePos, rotateWorld } from "../misc/rotateCTX.js";

const dt = 0.001; //Universal Rate of Update

class Charge {
    /**@type {Charge[]} */
    static all = [];
    /**
     * 
     * @param {Vector3} pos 
     * @param {Number} mass 
     * @param {Number} charge 
     * @param {Vector3} velocity 
     * @param {Vector3} acc 
     * @param {boolean} curve 
     */
    constructor(pos, mass, charge, velocity, acc, curve) {
        this.pos = pos;
        this.m = mass;
        this.q = charge;
        this.v = velocity;
        this.a = acc;
        //this.speed = velocity.magn;
        this.parametricCurve = curve;
        //this.immediatePastPos = null;
        this.Efield = new Vector3(0, 0, 0);
        this.Mfield = new Vector3(0, 0, 0);
        // if (curve) {
        //     this.pastPos = [
        //         pos
        //     ]
        // }
        Charge.all.push(this);
    }
    /**
     * sets Charge's pos to newPos
     * @param {Vector3} newPos 
     * @param {boolean} doOthers - recalculates Velocity & Speed
     */
    setPos(newPos, doOthers) {
        if (doOthers) {
            let v = Vector3.subtract(newPos, this.pos).scale(1 / dt);
            this.a = Vector3.subtract(this.v, v).scale(1 / dt)
            this.v = v;
        }
        this.immediatePastPos = this.pos;
        this.pos = newPos;
    }
    draw() {
        //this.v=Vector3.add(this.v,this.a);

        let color;
        if (this.q === 0) color = 'hsl(0, 0%, 100%)';
        drawCircle(this.pos,
            0.25,
            color || (this.q < 0 ? "hsl(0, 100%, 50%)" : "hsl(206, 100%, 50%)")
        );
    }
}


let clickStarted = false; //click once allow rotation, click again no rotation
let postition = [];//mouse pos
canvas.addEventListener('click', (e) => {
    if (!clickStarted) {
        postition = [e.x, e.y]
    }
    else {
        postition = [];
    }
    clickStarted = !clickStarted;
})
canvas.addEventListener('mousemove', (e) => {
    if (clickStarted) {
        rotateWorld(
            0,
            (e.x - postition[0]) / (100),
            (e.y - postition[1]) / (100)
        )
        postition = [e.x, e.y];
    }
})

export { Charge, dt }