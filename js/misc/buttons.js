import { setParticles, resetPreset, setPreset } from "../physics/charge.js";
import { Vector3 } from "../physics/vector3.js";
import { setTheta, setParticlesMax } from "./octree.js";
import {animate, notPause, setFieldsVar} from "../../main.js";

document.querySelector("#enterTHETA").addEventListener('click',()=>{
    let input = Number(document.querySelector("#THETA").value);
    if(input && input >= 0.1 && input <= 2) setTheta(input);
    else alert(`Theta input--${document.querySelector("#THETA").value}--is either not a number, less than 0.1, or greater than 2.`)
})
document.querySelector("#enterPMAX").addEventListener('click',()=>{
    let input = Number(document.querySelector("#PMAX").value);
    if(input && input >=1 ) setParticlesMax(parseInt(input.toString(),10));
    else alert(`Theta input--${document.querySelector("#PMAX").value}--is either not a number, zero, or negative.`)
})
document.querySelector("#enterPAMOUNT").addEventListener('click',()=>{
    let input;
    try{input=parseInt(document.querySelector("#PAMOUNT").value, 10);}
    catch(err){alert("Input for number of Particles is not a number")}
    if(input && input >= 1) setParticles(input);
    else alert("Input for number of Particles is less than one")
})
document.querySelector("#RESET").addEventListener('click', ()=>{
    setTheta(0.7); setParticlesMax(15);
    document.querySelector("#PMAX").value = 15;
    document.querySelector("#THETA").value = 0.7;
    resetPreset();
})
document.querySelector("#magnetEnter").addEventListener('click',()=>{
    let value = {mean: 0, stdDev: 5, applicationToAxis:"x", otherAxis:0.5}
    value.mean = Number(document.querySelector("#magnetMean").value);
    value.stdDev = Number(document.querySelector("#magnetStdDev").value);
    value.applicationToAxis = document.querySelector("#magnetAxis").value.trim().toLowerCase();
    if(value.applicationToAxis != "x" && value.applicationToAxis != "y" && value.applicationToAxis != "z") {
        alert("Axis to apply magnet must be x or y or z. Defaulting to x...");
        value.applicationToAxis = "x";
    }
    value.otherAxis = Number(document.querySelector("#magnetOthers").value);
    setPreset("magnet", value);
})
document.querySelector("#cubeEnter").addEventListener('click', ()=>{
    let value = Number(document.querySelector("#cube").value);
    setPreset("cube", value);
})
document.querySelector("#electrostaticEnter").addEventListener('click',()=>{
    setPreset("electrostatic");
})
document.querySelector("#magnetostaticEnter").addEventListener('click',()=>{
    setPreset("magnetostatic");
})
document.querySelector("#constantEEnter").addEventListener('click',()=>{
    const x = Number(document.querySelector("#constantEx").value);
    const y = Number(document.querySelector("#constantEy").value);
    const z = Number(document.querySelector("#constantEz").value);
    if (Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z)) {
        setPreset("constantE", new Vector3(x, y, z));
    } else {
        alert("Constant electric field values must be finite numbers.");
    }
})
document.querySelector("#constantMEnter").addEventListener('click',()=>{
    const x = Number(document.querySelector("#constantMx").value);
    const y = Number(document.querySelector("#constantMy").value);
    const z = Number(document.querySelector("#constantMz").value);
    if (Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z)) {
        setPreset("constantM", new Vector3(x, y, z));
    } else {
        alert("Constant magnetic field values must be finite numbers.");
    }
})
document.querySelector("#toroidalEnter").addEventListener('click',()=>{
    setPreset("toroidal");
})
document.querySelector("#PAUSE").addEventListener('click',()=>{
    notPause();
})
function easyQuery(id) {return document.querySelector(id).value.toLowerCase().trim();}

document.querySelector("#vectorsEnter").addEventListener('click',()=>{
    let otime = easyQuery("#vectorsO");
    if(otime == "nlogn") otime=true;
    else if(otime == "nn") otime=false;
    else {alert("Big O Time Input is not \"nlogn\" or \"nn\". Defaulting to nlogn... "); otime=true;};

    let magnetic = easyQuery("#vectorsM");
    if(magnetic == "true") magnetic = true;
    else if (magnetic == "false") magnetic = false;
    else {alert("Magnetic Time is not true or false. Deaulting to true..."); magnetic = true;}
    
    let electric = easyQuery("#vectorsE");
    if(electric == "true") electric = true;
    else if (electric == "false") electric = false;
    else {alert("Electric Fields input is not true or false. Defaulting to true..."); electric = true;}
    
    let on = easyQuery("#vectorsOn");
    if(on == "true") on = true;
    else if (on == "false") on = false;
    else {alert("Vector On/Off input is not true or false. Defaulting to false..."); on = false;}

    let range = Number(document.querySelector("#vectorsR").value);
    if(range && range >= 0) range = range;
    else {alert("Range input is not a positive number. Defaulting to 2..."); range = 2;}
    
    let distant = Number(document.querySelector("#vectorsD").value);
    if(distant && distant > 0) distant = distant;
    else {alert("Distance between Vectors input is not a positive number. Defaulting to 0.4..."); distant = 0.4;}
    
    let speed = Number(document.querySelector("#vectorsS").value);
    if(speed && speed > 0) speed = speed;
    else {alert("Speed per Frame input is not a positive number. Defaulting to 0.01..."); speed = 0.01;}
    
    setFieldsVar(on, otime, magnetic, electric, range, distant, speed)
})