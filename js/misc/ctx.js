import { arrToVector3, Vector3 } from "../physics/vector3.js";
import { globalRotation, rotatePos } from "./rotateCTX.js";
import { camera } from "./rotateCTX.js";
import { movement } from "./graph.js";

let canvas = document.querySelector('#simulation');
let ctx = canvas.getContext('2d');

let ch = canvas.height = innerHeight;
let cw = canvas.width = innerWidth;


function drawLine(p1, p2, color = `hsl(0, 0%, 100%)`) {
    ctx.beginPath();
    p1 = realPointToScreen(p1);
    p2 = realPointToScreen(p2);
    if (!p1 || !p2) { ctx.closePath(); return; }
    ctx.moveTo(p1[0], p1[1]);
    ctx.lineTo(p2[0], p2[1]);
    ctx.strokeStyle = color//`hsl(${distance3d([p1[0], p1[1], 0], [p2[0], p2[1], 0]) / 36},100%,50%)`;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
}

function drawVector(V, point, color){
    if (true) {
        //let p1 = realPoitToScreen(point);
        let visualScaler=0.2;
        let drawE = new Vector3(V.x, V.y, V.z).scale(visualScaler);
        let addedV = [point.x + (drawE.x), point.y + (drawE.y), point.z + (drawE.z)];
        //let added = [point[0] + (E[0]), point[1] + (E[1]), point[2] + (E[2])];
        //let p2 = realPointToScreen(added)
        drawLine([point.x, point.y, point.z], addedV, color);
        drawCircle(addedV, 0.5, color);
    }
}


/**DOES NOT require conversion to pixel before*/
/**
 * 
 * @param {Vector3} p1 
 * @param {Number} radius 
 * @param {String} color 
 * @returns 
 */
function drawCircle(p1, radius, color = "hsl(213, 90%, 53%)") {
    ctx.beginPath();
    let screenXY = realPointToScreen([p1.x, p1.y, p1.z]);
    if (!screenXY) { ctx.closePath(); return; }
    ctx.arc(screenXY[0], screenXY[1], Math.abs((factor / 2 * (radius) / (screenXY[2] - camera[2]))), 0, 360, false);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

let max = 5;
let factor = cw / (max * 2);
function realPointToScreen(arr) {
    const x = arr.x ?? arr[0];
    const y = arr.y ?? arr[1];
    const z = arr.z ?? arr[2];

    let p = {x:x,y:y,z:z}
    if(globalRotation.x!==0||globalRotation.y!==0||globalRotation.z!==0) p = rotatePos([x, y, z]);

    if (p.z <= camera[2]) return;

    return [
        (factor * (p.x - camera[0]) / (p.z - camera[2])) + (cw / 2),
        (factor * (p.y - camera[1]) / (p.z - camera[2])) + (ch / 2),
        p.z
    ];
}
addEventListener('keydown', (e) => {
    if (movement) return;
    switch (e.key) {
        case 'w':
            camera[2]+=1;
            break;
        case 's':
            camera[2]-=1;
            break;
        case 'a':
            camera[0]-=1;
            break;
        case 'd':
            camera[0]+=1;
            break;
        case 'q':
            camera[1]+=1;
            break;
        case 'e':
            camera[1]-=1;
            break;
    }

});

export {ch,cw,ctx,canvas,drawLine,realPointToScreen,drawCircle,drawVector};