function distance3d(p1, p2) {
    const x1 = p1.x ?? p1[0];
    const y1 = p1.y ?? p1[1];
    const z1 = p1.z ?? p1[2];

    const x2 = p2.x ?? p2[0];
    const y2 = p2.y ?? p2[1];
    const z2 = p2.z ?? p2[2];

    return Math.sqrt(
        (x1 - x2) ** 2 +
        (y1 - y2) ** 2 +
        (z1 - z2) ** 2
    );
}

class Vector3 {
    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    constructor(x, y, z) {
        //this.arr = [x, y, z]
        this.x = x;
        this.y = y;
        this.z = z;
    }
    get magn() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    get arr(){
        return [this.x,this.y,this.z];
    }
    /**
     * @param {number[]} pos 
     */
    set arr(pos){
        this.x=pos[0];
        this.y=pos[1];
        this.z=pos[2];
    }
    /**
     * 
     * @param {number} scaler 
     * @param {boolean} apply - applies to the vector begin used if true
     * @returns 
     */
    scale(scaler, apply) {
        if (apply) {
            this.x *= scaler;
            this.y *= scaler;
            this.z *= scaler;
            return this;
        }
        else {
            return new Vector3(
                this.x * scaler,
                this.y * scaler,
                this.z * scaler,
            )
        }
    }
    /**
     * @param {Vector3} vec1 
     * @param {Vector3} vec2
     */
    static crossProduct(vec1, vec2) {
        /*if (arr) return [
            vec1.y * vec2.z - vec1.z * vec2.y,
            vec1.z * vec2.x - vec1.x * vec2.z,
            vec1.x * vec2.y - vec1.y * vec2.x
        ];*/
        return new Vector3(
            vec1.y * vec2.z - vec1.z * vec2.y,
            vec1.z * vec2.x - vec1.x * vec2.z,
            vec1.x * vec2.y - vec1.y * vec2.x
        )
    }
    /**
     * @param {Vector3} vecs
     * Does not modify Vectors
     */
    static add(...vecs) {
        let pos = [0, 0, 0];
        for (let i = 0; i < vecs.length; i++) {
            pos[0] += vecs[i].x;
            pos[1] += vecs[i].y;
            pos[2] += vecs[i].z;
        }
        return new Vector3(
            pos[0],
            pos[1],
            pos[2],
        )
    }
    /**
     ** subtracts Vec1 - Vec2 
     * @param {Vector3} vec1 
     * @param {Vector3} vec2
     */
    static subtract(vec1, vec2) {
        return new Vector3(
            vec1.x - vec2.x,
            vec1.y - vec2.y,
            vec1.z - vec2.z,
        )
    }
    /**
     ** subtracts Vec1 - Scaler 
     * @param {Vector3} vec1 
     * @param {number} scaler
     */
    static subtractScaler(vec1, scaler) {
        return new Vector3(
            vec1.x - scaler,
            vec1.y - scaler,
            vec1.z - scaler,
        )
    }
    /**
     ** adds Vec1.x * Vec2.x, Vec1.y * Vec2.y ... 
     * @param {Vector3} vec1 
     * @param {Vector3} vec2
     */
    static dot(vec1, vec2) {
        return vec1.x * vec2.x + vec1.y * vec2.y + vec1.z * vec2.z;
    }
}

/**
 * 
 * @param {number[]} arr 
 */
function arrToVector3(arr){
    return new Vector3(arr[0],arr[1],arr[2])
}

export {Vector3, arrToVector3, distance3d}