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