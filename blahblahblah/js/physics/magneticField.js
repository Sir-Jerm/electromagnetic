import { Charge, dt } from "./charge.js";
import { Vector3 } from "./vector3.js";
import { drawCircle, drawLine, drawVector } from "../misc/ctx.js";

/**
 * 
 * @param {Vector3} point 
 * @returns Vector3
 * O(n) time for one point. o(n^2) for every charge.
 */
function magneticFieldAt(point, graph) {
    let B = new Vector3(0, 0, 0);

    for (let i = 0; i < Charge.all.length; i++) {

        let charge = Charge.all[i];

        let epsilon = 1e-9;
        if (Vector3.subtract(point, charge.pos).magn < epsilon) continue; //if distance is zero skip

        let dPos = Vector3.subtract(point, charge.pos);

        let r2 = Vector3.dot(dPos, dPos);  // squared distance
        let r = Math.sqrt(r2) //distance
        let r3 = r2 * r // cubed distance

        const k = (4 * Math.PI);

        let dB = Vector3.crossProduct(charge.v, dPos).scale(charge.q / (r3 * k), false)

        B = Vector3.add(B, dB);
    }

    //console.log('----')
    //drawVector(B, point, "rgb(34, 255, 0)");

    return B;
}

let computationsCounter=0;
/**
 * 
 * @param {Charge} target 
 * @param {Charge[]} charges 
 * @returns force of charges upon target
 * o(charges.length) time for one target. o(n^2) for every charge
 */
function mFieldBetweenCharges(target, charges) {
    let B = new Vector3(0, 0, 0);
    for (let i = 0; i < charges.length; i++) {
        let charge = charges[i];

        computationsCounter++;

        let epsilon = 1e-9;
        let dis = Vector3.subtract(target.pos, charge.pos);
        let disM = dis.magn;
        if (disM < epsilon) continue; //if distance is zero skip

        let dPos = dis;

        let r2 = Vector3.dot(dPos, dPos);  // squared distance
        let r = disM //distance
        let r3 = r2 * r // cubed distance

        const k = (4 * Math.PI);

        let dB = Vector3.crossProduct(charge.v, dPos).scale(charge.q / (r3 * k), false)

        B = Vector3.add(B, dB);
    }
    //drawVector(B, target.pos, "rgb(34, 255, 0)");
    return B;
}

/**
 * 
 * @param {Charge} charge 
 * @param {Vector3} centerOfMass 
 * @param {Vector3} totalV 
 * @param {number} totalCharge 
 */
function fakeChargeMField(charge, centerOfMass, totalV, totalCharge) {
    computationsCounter++
    //let charge = charges[i];

    //let epsilon = 1e-9;
    let dis = Vector3.subtract(charge.pos, centerOfMass);
    //if (dis.magn < epsilon) continue; //if distance is zero skip

    let dPos = dis;

    let r2 = Vector3.dot(dPos, dPos);  // squared distance
    let r = dis.magn //distance
    let r3 = r2 * r // cubed distance

    const k = (4 * Math.PI);

    return Vector3.crossProduct(totalV, dPos).scale(totalCharge / (r3 * k), false)
}

function resetCounterM(){
    computationsCounter=0;
}

export { magneticFieldAt, mFieldBetweenCharges, fakeChargeMField, computationsCounter, resetCounterM}