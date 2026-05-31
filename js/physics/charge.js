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
    static deleteAll() {
        let length = Charge.all.length;
        for (let i = 0; i < length; i++) {
            Charge.all.pop();
        }
        console.log(Charge.all)
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

let N = 3000;

function random(scale = 1) {
    return Math.random() < 0.5 ? Math.random() * scale : -Math.random() * scale;
}

//copied
function gaussianRandom(mean = 0, stdDev = 1) {
    let u1 = Math.random();
    let u2 = Math.random();
    let z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return z0 * stdDev + mean;
}

for (let i = 0; i < N; i++) {
    //storage[i] = new Vector3(random(dis / 2),random(dis / 2),random(dis / 2))
    let poss = new Vector3(gaussianRandom(0, 5), random(0.5), random(0.5))
    new Charge(poss, 1, poss.x, new Vector3(0, 0, 0), new Vector3(0, 0, 0), false);
}

function setParticles(num) {
    N = num;
    Charge.deleteAll();
    for (let i = 0; i < N; i++) {
        //storage[i] = new Vector3(random(dis / 2),random(dis / 2),random(dis / 2))
        let poss = new Vector3(gaussianRandom(0, 5), random(0.5), random(0.5))
        new Charge(poss, 1, poss.x, new Vector3(0, 0, 0), new Vector3(0, 0, 0), false);
    }
    console.log(Charge.all)
}

export { Charge, dt, setParticles}