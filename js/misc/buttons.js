import { setParticles } from "../physics/charge.js";
import { setTheta, setParticlesMax } from "./octree.js";

document.querySelector("#enterTHETA").addEventListener('click',()=>{
    let input = Number(document.querySelector("#THETA").value);
    if(input && input >= 0.1 && input <= 1) setTheta(input);
    else alert(`Theta input--${document.querySelector("#THETA").value}--is either not a number, less than 0.1, or greater than 1.`)
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

})