import { arrToVector3, Vector3 } from "./js/physics/vector3.js";
import { Vector4 } from "./js/physics/vector4.js";
import { Charge, dt } from "./js/physics/charge.js";
import { Charge4 } from "./js/physics/charge4.js";
import { ctx, cw, ch, drawLine, drawCircle, drawVector } from "./js/misc/ctx.js";
import { camera } from "./js/misc/rotateCTX.js";
import { electricFieldAt, counter, counter3 } from "./js/physics/electricField.js";
import { borisAlg, eulerMethod, leapFrog } from "./js/physics/integration.js";
import { computationsCounter, magneticFieldAt } from "./js/physics/magneticField.js";
import { quadTree3D, getNetForce, Point3D, recursion, resetCounterAll, iterations, counter1, dis } from "./js/misc/octree.js";
import { Graph } from "./js/misc/graph.js";

// function f(x, y) {
//     return Math.sin(x) * Math.cos(y);
// }
// function derivative(func, x, h = 0.0001) {
//     return Number(((func(x + h) - func(x)) / h).toPrecision(5));
// }
// function partialDerivative2d(func, x, y, vari, h = 0.0001) {
//     if (vari === 'x') {
//         return Number(((func(x + h, y) - func(x, y)) / h).toPrecision(5));
//     } else if (vari === 'y') {
//         return Number(((func(x, y + h) - func(x, y)) / h).toPrecision(5));
//     } else {
//         throw new Error("Invalid variable. Use 'x' or 'y'.");
//     }
// }

function round(x, rounder) {
    return Math.floor(x * rounder)
}

/**
 ** Does all the calculations
 * @param {Function} func 
 * 
 * @returns Kinetic Energy 
 */
function simulate(func) {
    let KE = 0;
    let p = 0; //momentum

    //Charge.all.sort((x,b)=>x.pos.z - b.pos.z)

    for (let i = 0; i < Charge.all.length; i++) {
        Charge.all[i].draw();

        let output = func(Charge.all[i])
        KE += output.KE;
        p += output.P;


        if (Charge.all[i].parametricCurve) {
            //console.log('wha')
            for (let j = 0; j < Charge.all[i].pastPos.length; j++) {
                //console.log('blu')
                if (Charge.all[i].pastPos[j + 1]) {
                    drawLine(Charge.all[i].pastPos[j], Charge.all[i].pastPos[j + 1], 'hsla(39, 100%, 50%, 0.36)');
                    //console.log('blu')
                }
            }
        }
    }
    return { KE: KE / Charge.all.length, P: p / Charge.all.length };
}

let global = {};

let N = 300;

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
    let poss = new Vector3(gaussianRandom(0,5), random(0.5), random(0.5))
    new Charge(poss, 1, poss.x, new Vector3(0, 0, 0), new Vector3(0, 0, 0), false);
}
//new Charge(new Vector3(0,0,0),1,1,new Vector3(0,0,0),new Vector3(0,0,0),true);
// new Charge(new Vector3(0.1,0.6,0.9),1.2,-1,new Vector3(0,0,0),new Vector3(0,0,0),true);
// new Charge(new Vector3(-0.8,0,0.5),0.8,1,new Vector3(0,0,0),new Vector3(0,0,0),true);
// new Charge(new Vector3(0.7,0.3,-0.4),1.8,-1,new Vector3(0,0,0),new Vector3(0,0,0),true);
// new Charge(new Vector3(-0.7,0,-0.4),0.1,1,new Vector3(0,0,0),new Vector3(0,0,0),true);
// new Charge(new Vector3(0.2,-0.8,0.4),0.5,-1,new Vector3(0,0,0),new Vector3(0,0,0),true);

function computeBounds(charges) {
    let min = new Vector3(Infinity, Infinity, Infinity);
    let max = new Vector3(-Infinity, -Infinity, -Infinity);

    for (let c of charges) {
        min.x = Math.min(min.x, c.pos.x);
        min.y = Math.min(min.y, c.pos.y);
        min.z = Math.min(min.z, c.pos.z);

        max.x = Math.max(max.x, c.pos.x);
        max.y = Math.max(max.y, c.pos.y);
        max.z = Math.max(max.z, c.pos.z);
    }

    let center = new Vector3(
        (min.x + max.x) / 2,
        (min.y + max.y) / 2,
        (min.z + max.z) / 2
    );

    let width = Math.max(
        max.x - min.x,
        max.y - min.y,
        max.z - min.z
    ) / 2;

    return { center: center, width: width * 1.5 }; // padding
}

let changeDis;
let starting;
let counter2 = { ite: 0, com: 0, v: 0 };
let performaceCheck = {check1:0,check2:0}
function animate() {
    requestAnimationFrame(animate);

    ctx.clearRect(0, 0, cw, ch)
    ctx.fillStyle = 'rgb(20, 18, 25)';
    ctx.fillRect(0, 0, cw, ch);

    // for(let x=-2;x<2;x+=0.1){
    //     for(let y=-2;y<2;y+=0.1){
    //         //for (let z=-2;z<2;z+=0.5){
    //             counter2.v+=0.000001;
    //             //magneticFieldAt(new Vector3(x,y,Math.sin(counter2)));
    //             electricFieldAt(new Vector3(x,y,Math.sin(counter2.v)), true);
    //         //}
    //     }
    // }

    changeDis = computeBounds(Charge.all);
    performaceCheck.check1 = performance.now();
    starting = new quadTree3D({}, changeDis.center, Charge.all, changeDis.width);
    recursion(starting);
    for (let i = 0; i < Charge.all.length; i++) {
        let force = getNetForce(starting, Charge.all[i], 0.5);
        Charge.all[i].Mfield = force.m;
        Charge.all[i].Efield = force.e;
    }
    performaceCheck.check2=performance.now();
    counter2 = { com: counter + counter1 + computationsCounter, ite: iterations, v:counter2.v };
    resetCounterAll();
    //performaceCheck.check1=performance.now();
    global = simulate(borisAlg);
    //performaceCheck.check2=performance.now();

    Graph.all.forEach((g)=>{
        g.update();
    })
}
animate()

let t=0;
new Graph(()=>{
    t+=0.1
    return t
}, ()=>{
    return performaceCheck.check2-performaceCheck.check1;
}, [100,100])

new Graph(()=>{
    return Charge.all[0].pos.magn*4;
}, ()=>{
    return Charge.all[0].v.magn*4;
}, [150,100])

//setInterval(()=>{console.log(iterations/1000, counter/1000, counter3/1000);resetCounterAll()}, 10000)
//setInterval(()=>{console.log(Charge.all[0])},5000)
//setInterval(()=>{animate();},10);
let interval = setInterval(
    () => {
        console.log(`KE: ${global.KE}. Momenta: ${global.P}.`);
        console.log(`Octree Iterations: ${counter2.ite}. Computations: ${counter2.com}`);
        console.log(`Megabytes being used: ${performance.memory.usedJSHeapSize / 1e+6}`);
        console.log(`Total Megabytes allocated: ${performance.memory.totalJSHeapSize / 1e+6}`);
        console.log(`Maximum Megabytes aviable: ${performance.memory.jsHeapSizeLimit / 1e+6}`);
        console.log(`Peformace: ${(performaceCheck.check2-performaceCheck.check1)}ms`);
        console.log('--------------------');
    },
    5000
);