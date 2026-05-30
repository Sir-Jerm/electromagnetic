import { Charge, dt } from "./charge.js";
import { Vector3 } from "./vector3.js";
import { electricFieldAt } from "./electricField.js";
import { magneticFieldAt } from "./magneticField.js";

let vectors = [];
const lightSpeed = 20;

/**
 * ------
 ** https://en.wikipedia.org/wiki/Euler_method
 * ------
 * @param {Charge} charge 
 * @return Kinetic Energy
 */
function eulerMethod(charge) {
    let pos = charge.pos
    let v = charge.v
    let a = charge.a

    //let Efield = electricFieldAt(new Vector3(pos.x, pos.y, pos.z), true, charge);
    let MField = new Vector3(0,0,0)//magneticFieldAt(new Vector3(pos.x, pos.y, pos.z));
    let Efield = electricFieldAt(new Vector3(pos.x, pos.y, pos.z), true, charge);
    let scaler = charge.q / charge.m;

    charge.setPos(Vector3.add(charge.pos, v.scale(dt,false)));

    let vCrossB = Vector3.crossProduct(v, MField);
    let acc = new Vector3(
        (Efield.x + vCrossB.x) * scaler,
        (Efield.y + vCrossB.y) * scaler,
        (Efield.z + vCrossB.z) * scaler
    );

    charge.v = new Vector3(
        (acc.x) * dt + v.x,
        (acc.y) * dt + v.y,
        (acc.z) * dt + v.z
    );
    //charge.a = acc;
    //charge.pastPos?.push(pos); //if charge.pasPos object exists then add pos to array

    return {
        "KE":0.5 * charge.m * (charge.v.x ** 2 + charge.v.y ** 2 + charge.v.z ** 2), 
        "Mfield":MField,
        "P":charge.m*charge.v.magn,
    }
}

/**
 * -------------
 ** Works by: 
 ** a_i = some function accerlation: a(x_i)
 ** v_soon = v_now + (a_now*dt)/2
 ** x_i1 = x_now + v_soon*dt
 ** v_i1 = v_soon + (a_i1*dt)/2
 ** https://en.wikipedia.org/wiki/Leapfrog_integration
 * ----------------
 * @param {Charge} charge
 * @returns Kinetic Energy
 */
function leapFrog(charge) {
    let pos = charge.pos
    let v = charge.v
    let a = charge.a

    let Efield = electricFieldAt(new Vector3(pos.x, pos.y, pos.z), false, charge);
    let MField = new Vector3(0,0,0)//magneticFieldAt(new Vector3(pos.x, pos.y, pos.z));
    let scaler = charge.q / charge.m;

    let vSoon = new Vector3(
        v.x + a.x * dt / 2,
        v.y + a.y * dt / 2,
        v.z + a.z * dt / 2
    );

    charge.setPos(Vector3.add(charge.pos, vSoon.scale(dt,false)));

    let vCrossB = Vector3.crossProduct(vSoon, MField);
    let acc = new Vector3(
        (Efield.x + vCrossB.x) * scaler,
        (Efield.y + vCrossB.y) * scaler,
        (Efield.z + vCrossB.z) * scaler
    );

    charge.v = new Vector3(
        (acc.x) * dt / 2 + vSoon.x,
        (acc.y) * dt / 2 + vSoon.y,
        (acc.z) * dt / 2 + vSoon.z
    );
    //charge.a = acc;
    //charge.pastPos?.push(pos); //if charge.pasPos object exists then add pos to array

    return {
        "KE":0.5 * charge.m * (charge.v.x ** 2 + charge.v.y ** 2 + charge.v.z ** 2), 
        "Mfield":MField,
        "P":charge.m*charge.v.magn,
    }
}

/**
 * ------------
 ** https://www.osti.gov/servlets/purl/1090047
 ** https://en.wikipedia.org/wiki/Particle-in-cell#The_particle_mover
 ** How it works:
 ** We get a half step velocity
 ** We need rotation the magnetic field applies on the charge
 ** We apply that rotation on the velocity
 ** We get another half step velocity (to make a whole step)
 ** We update the position using the rotated velocity 
 * ------------ 
 * @param {Charge} charge 
 * @return Kinetic Energy
 */
function borisAlg(charge) {
    let pos = charge.pos
    let v = charge.v
    //let a = charge.a
    let Efield = charge.Efield//electricFieldAt(new Vector3(pos.x, pos.y, pos.z), false, charge);
    let MField = charge.Mfield//magneticFieldAt(new Vector3(pos.x, pos.y, pos.z), true);
    let scaler = charge.q / charge.m; // changes Electric field (qF=E) to force (F=ma) to acceleration

    //we get half step velocity
    let halfStepV = Vector3.add(v, Efield.scale(scaler * dt / 2, false));

    //we get the magnetic rotations
    let t = MField.scale(scaler * dt / 2, false);
    let s = t.scale(2 / (1 + (t.magn) ** 2));
    let vPrime = Vector3.add(halfStepV, Vector3.crossProduct(halfStepV, t, false));
    let vPlus = Vector3.add(halfStepV, Vector3.crossProduct(vPrime, s, false));

    //the other half step
    //let newField = electricFieldAt(pos, true, charge);
    let vNew = Vector3.add(vPlus, Efield.scale(scaler * dt / 2, false))

    //update pos & velocity
    charge.setPos(Vector3.add(
        new Vector3(pos.x, pos.y, pos.z), 
        vNew.scale(dt, false))
    , false);

    charge.a= Vector3.subtract(vNew,charge.v).scale(1/dt); // NOT applied, ONLY stored
    charge.v = vNew;
    charge.pastPos?.push(pos); //if charge.pasPos object exists then add pos to array

    return {
        "KE":0.5 * charge.m * (charge.v.x ** 2 + charge.v.y ** 2 + charge.v.z ** 2), //kinetic energy
        "Mfield":MField, //magnetic field
        "P":charge.m*charge.v.magn, // momentum
    }
}

export {borisAlg, leapFrog, eulerMethod}