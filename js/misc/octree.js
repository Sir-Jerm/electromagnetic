import { eFieldBetweenCharges, electricFieldAt, fakeChargeEF, counter, resetCounter0 } from "../physics/electricField.js";
import { Vector3 } from "../physics/vector3.js";
import { Charge } from "../physics/charge.js";
import { fakeChargeMField, mFieldBetweenCharges, resetCounterM } from "../physics/magneticField.js";

//copied
function gaussianRandom(mean = 0, stdDev = 1) {
    let u1 = Math.random();
    let u2 = Math.random();
    let z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return z0 * stdDev + mean;
}

let iterations = 0;

function random(scale = 1) {
    return Math.random() < 0.5 ? Math.random() * scale : -Math.random() * scale;
}

let pointsToDraw = [];

class Point3D {
    /**
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

function randomCharge() {
    return Charge.all[Math.round(Math.random() * Charge.all.length) - 1];
}
let counter1 = 0;
function centerOfMass(tree) {
    if(tree.charges?.length===1) return tree.charges[0].pos;
    let m = 0;
    let pos = new Vector3(0, 0, 0);
    let q = 0;
    let v = new Vector3(0,0,0);
    for (let c of tree.charges) {
        counter1++;
        pos = Vector3.add(pos, c.pos.scale(c.m));
        v = Vector3.add(v, c.v.scale(c.m))
        q += c.q;
        m += c.m;
    }
    tree.totalCharge = q;
    tree.totalV = v.scale(1/m)
    return pos.scale(1 / m);
}

let startCharge = randomCharge();

class quadTree3D {
    /**
     * 
     * @param {Object} children 
     * @param {Point3D} midpoint 
     * @param {Charge[]} charges 
     * @param {number} width 
     */
    constructor(children = {}, midpoint, charges, width, path) {
        this.children = children;
        this.midpoint = midpoint;
        this.charges = charges;
        this.centerOfMass=centerOfMass(this);
        //this.netForce = new Vector3(0, 0, 0);
        this.width = width;

        // this calculates the points to draw the octree.
        // pointsToDraw.push( //Stores ALL positions of ALL children. MUST BE CLEARED EVERY TIME IT IS CALLED. MASSIVE MEMORY LEAK POTENTIAL
        //     [ //This is an unused feature anyways. there is no point in uncommenting this.
        //         new Point3D(midpoint.x, midpoint.y - width, midpoint.z),
        //         new Point3D(midpoint.x, midpoint.y + width, midpoint.z)
        //     ],
        //     [
        //         new Point3D(midpoint.x - width, midpoint.y, midpoint.z),
        //         new Point3D(midpoint.x + width, midpoint.y, midpoint.z)
        //     ],
        //     [
        //         new Point3D(midpoint.x, midpoint.y, midpoint.z - width),
        //         new Point3D(midpoint.x, midpoint.y, midpoint.z + width)
        //     ]
        // );
    }
    /**
     * 
     * @param {quadTree3D} child 
     * @param {string} name 
     */
    addChild(child, name) {
        this.children[name] = child;
        //this.netForce = Vector3.add(this.netForce,child.netForce);
        //this.totalCharge+=child.totalCharge; 
        this.centerOfMass = Vector3.add(this.centerOfMass,child.centerOfMass);
        this.charges = [];
    }
    get hasChildren() {
        return Object.keys(this.children).length > 0;
    }
    /**
     * @param {quadTree3D} tree 
     */
    static divide(tree) {
        let mp = tree.midpoint
        let divider = tree.width / 2

        let neBMidPoint = new Point3D(mp.x + divider, mp.y + divider, mp.z - divider); //ne = northeast. b = backwards.
        let seBMidPoint = new Point3D(mp.x + divider, mp.y - divider, mp.z - divider);
        let nwBMidPoint = new Point3D(mp.x - divider, mp.y + divider, mp.z - divider);
        let swBMidPoint = new Point3D(mp.x - divider, mp.y - divider, mp.z - divider);

        let neFMidPoint = new Point3D(mp.x + divider, mp.y + divider, mp.z + divider);
        let seFMidPoint = new Point3D(mp.x + divider, mp.y - divider, mp.z + divider);
        let nwFMidPoint = new Point3D(mp.x - divider, mp.y + divider, mp.z + divider);
        let swFMidPoint = new Point3D(mp.x - divider, mp.y - divider, mp.z + divider); //sw = southwest. f = forwards.

        let neB = [], seB = [], nwB = [], swB = [], neF = [], seF = [], nwF = [], swF = [];

        for (let p of tree.charges) {
            iterations++;
            if (p.pos.x >= mp.x && p.pos.y >= mp.y && p.pos.z < mp.z) neB.push(p); //if there are charges within subnodes boundaries put them in the node array
            else if (p.pos.x >= mp.x && p.pos.y < mp.y && p.pos.z < mp.z) seB.push(p);
            else if (p.pos.x < mp.x && p.pos.y >= mp.y && p.pos.z < mp.z) nwB.push(p);
            else if (p.pos.x < mp.x && p.pos.y < mp.y && p.pos.z < mp.z) swB.push(p);
            else if (p.pos.x >= mp.x && p.pos.y >= mp.y && p.pos.z >= mp.z) neF.push(p);
            else if (p.pos.x >= mp.x && p.pos.y < mp.y && p.pos.z >= mp.z) seF.push(p);
            else if (p.pos.x < mp.x && p.pos.y >= mp.y && p.pos.z >= mp.z) nwF.push(p);
            else if (p.pos.x < mp.x && p.pos.y < mp.y && p.pos.z >= mp.z) swF.push(p);
        }

        if (neB.length > 0) tree.addChild(new quadTree3D({}, neBMidPoint, neB, divider), 'neB'); //if there are no charges do not add them
        if (seB.length > 0) tree.addChild(new quadTree3D({}, seBMidPoint, seB, divider), 'seB');
        if (nwB.length > 0) tree.addChild(new quadTree3D({}, nwBMidPoint, nwB, divider), 'nwB');
        if (swB.length > 0) tree.addChild(new quadTree3D({}, swBMidPoint, swB, divider), 'swB');

        if (neF.length > 0) tree.addChild(new quadTree3D({}, neFMidPoint, neF, divider), 'neF');
        if (seF.length > 0) tree.addChild(new quadTree3D({}, seFMidPoint, seF, divider), 'seF');
        if (nwF.length > 0) tree.addChild(new quadTree3D({}, nwFMidPoint, nwF, divider), 'nwF');
        if (swF.length > 0) tree.addChild(new quadTree3D({}, swFMidPoint, swF, divider), 'swF');

        return tree.children;
    }

}

let maxParticles = 10;
let theta = 0.9;

let setTheta = (thetat)=>{
    theta = thetat;
};
let setParticlesMax = (max)=>{
    maxParticles = max;
}

/**
 * @param {quadTree3D} tree 
 * @param {Charge} target 
 * @returns 
 */
function getNetForce(tree, target) {
    //console.log(tree)
    if (!tree.hasChildren && tree.charges.length > 0) {
        return {e:eFieldBetweenCharges(target, tree.charges),m:mFieldBetweenCharges(target,tree.charges)};
    }

    let dis = Vector3.subtract(target.pos, tree.centerOfMass).magn;
    if (dis<=1e-3) return {e:new Vector3(0,0,0),m:new Vector3(0,0,0)};
    let size = tree.width;
    //counter1++;

    if (size / dis < theta) {
        return {
            e:fakeChargeEF(target, tree.centerOfMass, tree.totalCharge),
            m:fakeChargeMField(target,tree.centerOfMass,tree.totalV,tree.totalCharge)
        };
    }
    else {
        let Efield = new Vector3(0, 0, 0)
        let Mfield = new Vector3(0,0,0)
        let keys = Object.keys(tree.children);

        for (let ij = 0; ij < keys.length; ij++) {
            let force = getNetForce(tree.children[keys[ij]], target, theta);
            Mfield = Vector3.add(Mfield,force.m);
            Efield = Vector3.add(Efield,force.e);
        }
        return {e:Efield, m:Mfield};
    }


    // if(Object.keys(this.children).length>0){
    //     let base = new Vector3(0,0,0);
    //     for(let c of this.children){
    //         Vector3.add(base,c.getNetForce());
    //     }
    //     return base;
    // } else if (this.charges) {
    //     return eFieldBetweenCharges(this.charges);
    // } 
    // else {
    //     console.log(this.midpoint,this.charges,this.children);
    //     console.log("This lil guy shouldn't exist.");
    // }
}

//let tree = doBlock(points, [0, 0], 1);

//let starting = new quadTree3D({}, new Point3D(0, 0, 0), Charge.all, dis)
//console.log(Charge.all)

let dis = 5;
/**
 * @param {quadTree3D} tree 
 */
function recursion(tree, startingTree=false) {
    if(startingTree) pointsToDraw = []; //clears this variable to prevent a memory leak. DO NOT REMOVE VERY IMPORTANT
    if (tree.charges.length <= maxParticles || tree.width <= dis / (2 ** 5)) {
        return;
    }

    let p = quadTree3D.divide(tree);
    for (let i in p) {
        recursion(p[i]);
    }
}
// recursion(starting);

// for(let i=0;i<Charge.all.length;i++){
//     getNetForce(starting,Charge.all[i],0.7);
// }

function iterate(set) {
    iterations = set;
}
function resetCounterAll() {
    resetCounterM()
    counter1 = 0;
    resetCounter0();
    iterate(0);
}

//console.log(starting.points.filter(p => p.x >= starting.midpoint.x && p.pos.y >= mp))
//console.log(starting, iterations, N * Math.log(N), N * N, counter+counter1)

export { setParticlesMax, setTheta, quadTree3D, pointsToDraw, getNetForce, Point3D, recursion, counter1, iterations, resetCounterAll, dis }