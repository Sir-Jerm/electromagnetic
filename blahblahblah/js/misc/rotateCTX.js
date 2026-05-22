// import { arrToVector3, Vector3 } from "./vector3.js";


let camera = [0,0,-3]
// function rotateY(x, y, z, radians) {
//     let xl = x * Math.cos(radians) + z * Math.sin(radians);
//     let zl = z * Math.cos(radians) - x * Math.sin(radians);
//     return [xl, y, zl];
// }
// function rotateZ(x, y, z, radians) {
//     let yl = y * Math.cos(radians) + x * Math.sin(radians);
//     let xl = x * Math.cos(radians) - y * Math.sin(radians);
//     return [xl, yl, z];
// }
// function rotateX(x, y, z, radians) {
//     let zl = z * Math.cos(radians) + y * Math.sin(radians);
//     let yl = y * Math.cos(radians) - z * Math.sin(radians);
//     return [x, yl, zl];
// }
// /**
//  * 
//  * @param {Vector3} point1 
//  * @param {Vector3} point2 
//  * @param {number} radians 
//  * @returns newPos
//  */
// function rotateYByPoint(point1, point2, radians) {
//     let p = point1.x - point2.y;
//     let c = point1.z - point2.z;

//     let r = rotateY(p, point1.y, c, radians);

//     return [r[0] + point2.x, point1.y, r[2] + point2.z]
// }
// /**
//  * 
//  * @param {Vector3} point1 
//  * @param {Vector3} point2 
//  * @param {number} radians 
//  * @returns newPos
//  */
// function rotateXByPoint(point1, point2, radians) {
//     let p = point1.y - point2.y;
//     let c = point1.z - point2.z;

//     let r = rotateX(point1.x, p, c, radians);

//     return [point1.x, r[1] + point2.y, r[2] + point2.z]
// }
// /**
//  * 
//  * @param {Vector3} point1 
//  * @param {Vector3} point2 
//  * @param {number} radians 
//  * @returns newPos
//  */
// function rotateZByPoint(point1, point2, radians) {
//     let p = point1.y - point2.y;
//     let c = point1.x - point2.x;

//     let r = rotateZ(c, p, point1.z, radians);

//     return [r[0] + point2.x, r[1] + point2.y, point1.z]
// }

// /**
//  * 
//  * @param {Vector3} pos 
//  * @param {number} radiansX 
//  * @param {number} radiansY 
//  * @param {number} radiansZ 
//  */
// let globalRotation = {
//     "x":0,"y":0,"z":0
// }
// function rotateByOrigin(pos,radiansX,radiansY,radiansZ, apply)
// {
//     if (apply) {globalRotation.x+=radiansX;globalRotation.y+=radiansY;globalRotation.z+=radiansZ;}
//     let origin = new Vector3(0,0,0)
//     let x = rotateXByPoint(pos,origin,radiansX);
//     let y = rotateYByPoint(arrToVector3(x),origin,radiansY);
//     let z = rotateZByPoint(arrToVector3(y),origin,radiansZ);
//     return arrToVector3(z);
// }

// export {rotateByOrigin, globalRotation, camera}

let cos = Math.cos
let sin = Math.sin
let computations = 0;
function resetComputationsCounter(){
    computations=0;
}
function rotationMatrix(yaw, pitch, roll){
    computations++;
    return [
        [
            cos(yaw)*cos(pitch), 
            cos(yaw)*sin(pitch)*sin(roll)-sin(yaw)*cos(roll), 
            cos(yaw)*sin(pitch)*cos(roll)+sin(yaw)*sin(roll)
        ],
        [
            sin(yaw)*cos(pitch), 
            sin(yaw)*sin(pitch)*sin(roll)+cos(yaw)*cos(roll), 
            sin(yaw)*sin(pitch)*cos(roll)-cos(yaw)*sin(roll)
        ],
        [
            -sin(pitch),
            cos(pitch)*sin(roll),
            cos(pitch)*cos(roll)
        ]
    ]
}
function dotProduct(m1,m2){
    computations++;
    return m1[0] * m2[0] + m1[1] * m2[1] + m1[2] * m2[2];
}

let globalRotation = {x:0,y:0,z:0,rotationMatrix:[[0,0,0],[0,0,0],[0,0,0]]}

export const rotateWorld = (yaw,pitch,roll)=>{
    globalRotation.x+=yaw;
    globalRotation.y+=pitch;
    globalRotation.z+=roll;
    globalRotation.rotationMatrix = rotationMatrix(
        globalRotation.x,
        globalRotation.y,
        globalRotation.z
    );
}

/**
 * 
 * @param {number[]} pos 
 * @returns 
 */
export const rotatePos = (pos) => {
    let RM = globalRotation.rotationMatrix;
    return {
        x:dotProduct(RM[0],pos),
        y:dotProduct(RM[1],pos),
        z:dotProduct(RM[2],pos)
    }
}

export {globalRotation,resetComputationsCounter, computations, camera}