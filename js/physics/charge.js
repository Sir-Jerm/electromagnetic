import { drawCircle, canvas } from "../misc/ctx.js";
import { Vector3 } from "./vector3.js";
import { rotatePos, rotateWorld } from "../misc/rotateCTX.js";

let dt = 0.001; //Universal Rate of Update

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

let PRESETS = {
    "magnet": {
        applied: true, value: {
            mean: 0, stdDev: 5, applicationToAxis: "x", otherAxis: 0.5
        }
    }, "Electrostatic": { applied: false },
    "Magnetostatic": { applied: false }, "ConstantMagnetic": { applied: false, value: new Vector3(0, 1, 0) },
    "ConstantElectric": { value: new Vector3(0, 0, 0), applied: false }, cube: { applied: false, sideLength: 10 },
    "toroidal_charge_ring": {
        applied: false,
        "particles": [
            { "pos": [0.3, 0.0, 0.0], "mass": 1.0, "charge": 0.1, "velocity": [0, 0, 0], "acc": [0, 0, 0], "curve": false },
            { "pos": [0.212, 0.212, 0.0], "mass": 1.0, "charge": 0.1, "velocity": [0, 0, 0], "acc": [0, 0, 0], "curve": false },
            { "pos": [0.0, 0.3, 0.0], "mass": 1.0, "charge": 0.1, "velocity": [0, 0, 0], "acc": [0, 0, 0], "curve": false },
            { "pos": [-0.212, 0.212, 0.0], "mass": 1.0, "charge": 0.1, "velocity": [0, 0, 0], "acc": [0, 0, 0], "curve": false },
            { "pos": [-0.3, 0.0, 0.0], "mass": 1.0, "charge": 0.1, "velocity": [0, 0, 0], "acc": [0, 0, 0], "curve": false },
            { "pos": [-0.212, -0.212, 0.0], "mass": 1.0, "charge": 0.1, "velocity": [0, 0, 0], "acc": [0, 0, 0], "curve": false },
            { "pos": [0.0, -0.3, 0.0], "mass": 1.0, "charge": 0.1, "velocity": [0, 0, 0], "acc": [0, 0, 0], "curve": false },
            { "pos": [0.212, -0.212, 0.0], "mass": 1.0, "charge": 0.1, "velocity": [0, 0, 0], "acc": [0, 0, 0], "curve": false }
        ]
    }
};



let N = 100;

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

function generateMagnet() {
    for (let i = 0; i < N; i++) {
        let poss;
        let charge;
        //storage[i] = new Vector3(random(dis / 2),random(dis / 2),random(dis / 2))
        if (PRESETS.magnet.value.applicationToAxis == "x")
        {
            poss = new Vector3(gaussianRandom(PRESETS.magnet.value.mean, PRESETS.magnet.value.stdDev),random(PRESETS.magnet.value.otherAxis) , random(PRESETS.magnet.value.otherAxis))
            charge = poss.x;
        }
        else if (PRESETS.magnet.value.applicationToAxis == "y") {
            poss = new Vector3(random(PRESETS.magnet.value.otherAxis), gaussianRandom(PRESETS.magnet.value.mean, PRESETS.magnet.value.stdDev), random(PRESETS.magnet.value.otherAxis))
            charge = poss.y;
        } else if (PRESETS.magnet.value.applicationToAxis == "z") {
            poss = new Vector3(random(PRESETS.magnet.value.otherAxis), random(PRESETS.magnet.value.otherAxis), gaussianRandom(PRESETS.magnet.value.mean, PRESETS.magnet.value.stdDev))
            charge = poss.z;
        }


        new Charge(poss, 1, charge, new Vector3(0, 0, 0), new Vector3(0, 0, 0), false);
    }
}

function generateCube() {
    for (let i = 0; i < N; i++) {
        //storage[i] = new Vector3(random(dis / 2),random(dis / 2),random(dis / 2))
        let poss = new Vector3(random(PRESETS.cube.sideLength), random(PRESETS.cube.sideLength), random(PRESETS.cube.sideLength));
        new Charge(poss, 1, random(10), new Vector3(0, 0, 0), new Vector3(0, 0, 0), false);
    }
}

generateMagnet();

let numberOfParticles = N;

//sets the number of particles
function setParticles(num) {
    N = num;
    numberOfParticles = N;
    Charge.deleteAll();

    if (PRESETS.magnet.applied) generateMagnet();
    else if (PRESETS.cube.applied) generateCube();

    //console.log(Charge.all)
}

//sets the universal rate of change (dt) to specific time value
function setDT(time) {
    dt = time;
}

function resetPreset(magnetApplied = true) {
    PRESETS = {
        "magnet": {
            applied: magnetApplied, value: {
                mean: 0, stdDev: 5, applicationToAxis: "x", otherAxis: 0.5
            }
        },
        "Electrostatic": { applied: false },
        "Magnetostatic": { applied: false },
        "ConstantMagnetic": { applied: false, value: new Vector3(0, 1, 0) },
        "ConstantElectric": { value: new Vector3(0, 1, 0), applied: false },
        cube: { applied: false, sideLength: 10 },
        "toroidal_charge_ring": {
            applied: false,
            "particles": [
                { "pos": [0.3, 0.0, 0.0], "mass": 1.0, "charge": 0.1, "velocity": [0, 0, 0], "acc": [0, 0, 0], "curve": false },
                { "pos": [0.212, 0.212, 0.0], "mass": 1.0, "charge": 0.1, "velocity": [0, 0, 0], "acc": [0, 0, 0], "curve": false },
                { "pos": [0.0, 0.3, 0.0], "mass": 1.0, "charge": 0.1, "velocity": [0, 0, 0], "acc": [0, 0, 0], "curve": false },
                { "pos": [-0.212, 0.212, 0.0], "mass": 1.0, "charge": 0.1, "velocity": [0, 0, 0], "acc": [0, 0, 0], "curve": false },
                { "pos": [-0.3, 0.0, 0.0], "mass": 1.0, "charge": 0.1, "velocity": [0, 0, 0], "acc": [0, 0, 0], "curve": false },
                { "pos": [-0.212, -0.212, 0.0], "mass": 1.0, "charge": 0.1, "velocity": [0, 0, 0], "acc": [0, 0, 0], "curve": false },
                { "pos": [0.0, -0.3, 0.0], "mass": 1.0, "charge": 0.1, "velocity": [0, 0, 0], "acc": [0, 0, 0], "curve": false },
                { "pos": [0.212, -0.212, 0.0], "mass": 1.0, "charge": 0.1, "velocity": [0, 0, 0], "acc": [0, 0, 0], "curve": false }
            ]
        }
    };
}

function setPreset(presetType, value) {
    resetPreset(false);
    if (presetType == "magnet") { PRESETS.magnet.value = value; PRESETS.magnet.applied = true; setParticles(N);}
    else if (presetType == "electrostatic") PRESETS.Electrostatic.applied = true;
    else if (presetType == "magnetostatic") PRESETS.Magnetostatic.applied = true;
    else if (presetType == "constantE") { PRESETS.ConstantElectric.applied = true; PRESETS.ConstantElectric.value = value }
    else if (presetType == "constantM") { PRESETS.ConstantMagnetic.applied = true; PRESETS.ConstantMagnetic.value = value }
    else if (presetType == "cube") { PRESETS.cube.applied = true; PRESETS.cube.sideLength = value; setParticles(N); }
    else if (presetType == "toroidal") PRESETS.toroidal_charge_ring.applied = true;
}

export { numberOfParticles, setPreset, Charge, dt, setParticles, PRESETS, setDT, resetPreset }