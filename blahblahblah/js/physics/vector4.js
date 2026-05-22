import { Vector3 } from "./vector3.js";

class Vector4 {
    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     * @param {Number} t 
     */
    constructor(x, y, z, t) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.t = t;
    }
    get magn() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.t * this.t);
    }
    /**
     * DOES NOT SCALE TIME
     * @param {number} scaler 
     * @param {boolean} apply - applies to the vector begin used if true
     * @returns 
     */
    scale(scaler) {
        return new Vector4(
            this.x * scaler,
            this.y * scaler,
            this.z * scaler,
            this.t
        )
    }
}

export { Vector4 }