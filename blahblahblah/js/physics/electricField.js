import { Charge } from "./charge.js";
import { Vector3 } from "./vector3.js";
import { Vector4 } from "./vector4.js";
import { drawCircle, drawLine, drawVector } from "../misc/ctx.js";

/**
 * 
 * @param {Vector3} point 
 * @param {number} time 
 * @param {Charge} excludeCharge
 * @param {boolean} graph 
 * @returns 
 */
function electricFieldRelativistic(point, time, excludeCharge, graph=false) {
    let E = new Vector3(0, 0, 0);

    for (let i = 0; i < Charge.all.length; i++) {
        //if charge being calculated is itself do nothing.
        //i.e. if the frame of reference is being calculated then do nothing.
        if (Charge.all[i] === excludeCharge) continue;
        let charge = Charge.all[i];
        let q = charge.q;

        let dis = Vector3.subtract(point,charge.pos)
        let t_r = time - dis.magn / speedOfLight;

        let pos_r = Vector3.subtract(point,charge.pos)
    }

    return E;
}



function electricConstant(charge){
    return charge.q / 4*Math.PI;
}

/**
 * 
 * @param {Vector3} point 
 * @param {boolean} graph 
 * @returns Units: q/dis^2
 * 
 * ---
 * O(n^2) Time
 */
let counter3=0;
function electricFieldAt(point, graph, excludeCharge = null) {
    let E = new Vector3(0, 0, 0);

    //softened
    for (let i = 0; i < Charge.all.length; i++) {
        counter3++;

        let charge = Charge.all[i];
        if (charge === excludeCharge) continue; //prevent dPos from being (0,0,0).

        let dPos = Vector3.subtract(point, charge.pos);
        let r2 = Vector3.dot(dPos, dPos);  // squared distance
        const k = 1 / (4 * Math.PI);

        let softener = 0.1;
        let denominator = 1 / (Math.sqrt(r2 + softener * softener) ** 3);

        E = Vector3.add(E, dPos.scale(charge.q * k * denominator));
    }

    if(graph) drawVector(E, point, "rgb(255, 255, 255)")

    return E;

    //non-renormalization
    // for (let i = 0; i < Charge.all.length; i++) {
    //     if charge being calculated is itself do nothing.
    //     i.e. if the frame of reference is being calculated then do nothing.
    //     if (Charge.all[i] === excludeCharge) continue;
    //     let charge = Charge.all[i];
    //     let dPos = Vector3.subtract(point, charge.pos).scale(charge.q);
    //     let dis = distance3d([Charge.all[i].pos.x, Charge.all[i].pos.y, Charge.all[i].pos.z], point);
    //     dis = Math.max(dis, 0.05);//prevent dis=0 for division
    //     let epislon = 0.001;
    //     E = Vector3.add(E, dPos.scale(1 / (dis ** 2)));
    // }

}

/**
 * 
 * @param {Charge[]} charges 
 * @returns 
 */
let counter = 0;
function eFieldBetweenCharges(target, charges) {
    let E = new Vector3(0, 0, 0);

    //softened
    for (let i = 0; i < charges.length; i++) {
        if (target === charges[i]) continue;
        counter++;
        let dPos = Vector3.subtract(target.pos, charges[i].pos);
        let r2 = Vector3.dot(dPos, dPos);  // squared distance
        const k = 1 / (4 * Math.PI);

        let softener = 0.1;
        let denominator = 1 / (Math.sqrt(r2 + softener * softener) ** 3);

        E = Vector3.add(E, dPos.scale(charges[i].q * k * denominator));
    }

    //drawVector(E, point, "rgb(255, 255, 255)")
    return E;
}

/**
 * 
 * @param {Charge} charge 
 * @param {Vector3} centerOfMass 
 * @param {number} totalCharge 
 */
function fakeChargeEF(charge, centerOfMass, totalCharge) {
    let dPos = Vector3.subtract(charge.pos, centerOfMass);
    let r2 = Vector3.dot(dPos, dPos);  // squared distance
    const k = 1 / (4 * Math.PI);
    counter++;
    let softener = 0.1;
    let denominator = 1 / (Math.sqrt(r2 + softener * softener) ** 3);

    return dPos.scale(totalCharge * k * denominator);
}

function resetCounter0() {
    counter = 0;
    counter3=0;
}

export { electricFieldAt, eFieldBetweenCharges, fakeChargeEF, counter, resetCounter0, counter3 }