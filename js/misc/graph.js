

let max = 5;
let factor = 10;

function drawLine(xy1, xy2, ctx, color="rgb(255,0,0)") {
    ctx.beginPath();
    ctx.moveTo(xy1[0], xy1[1]);
    ctx.lineTo(xy2[0], xy2[1]);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
}

class Graph {
    /**
     * @type Graph[]
     */
    static all = [];
    /**
     * @param {function} xParam 
     * @param {function} yParam 
     * @param {number[]} pos 
     */
    constructor(xParam, yParam, pos) {
        this.xParam = xParam;
        this.yParam = yParam;
        this.screenPos = pos;
        this.max = [1, 1];
        this.moveCamera = [0, 0]
        this.points = [];
        this.createHTML()
        Graph.all.push(this);
    }
    realPointToScreen(arr) {
        const x = arr[0];
        const y = arr[1];

        return [
            (10 * (x + this.moveCamera[0]) + (this.html.width / 2)) / this.max[0],
            (10 * (y + this.moveCamera[1]) + (this.html.height / 2)) / this.max[1]
        ];
    }
    createHTML() {
        this.html = document.createElement('canvas');

        this.html.style.transform = `translateY(${this.screenPos[1]}px) translate(${this.screenPos[0]}px) scaleY(-1)`;
        //this.html.style.transform = `translate(${this.screenPos[0]}px)`;
        //this.html.style.top = this.screenPos[1];

        this.html.id = `${Graph.all.length}`;
        this.html.classList.add("graph");

        this.html.width = innerWidth / 2;
        this.html.height = innerHeight / 2;

        document.body.appendChild(this.html);
        this.ctx = this.html.getContext('2d');

        this.html.addEventListener("click", (e) => {
            movement = !movement;
            if (movement) { element = e.target; graph = this }
            else { element = null; graph = null; }
            console.log(element, movement)
            //e.target.style.transform = `translateY(${e.y}px) translate(${e.x}px)`;
        })
    }
    update() {
        this.ctx.clearRect(0, 0, this.html.width, this.html.height)
        this.ctx.fillStyle = 'rgb(30, 28, 34)';
        this.ctx.fillRect(0, 0, this.html.width, this.html.height);

        this.graphPoints(this.xParam(), this.yParam());
        //let maxY = 0;

        for (let i = 0; i < this.points.length; i++) {

            let adder = 20;
            let pointsPix = this.realPointToScreen(this.points[i]);
            if (pointsPix[0] < 0 || pointsPix[0] > this.html.width) continue;
            if (pointsPix[1] + adder> this.html.height) {
                //if(pointsPix[i]>maxY) maxY = pointsPix;
                this.max[1]+=1;
                //pointsPix = this.realPointToScreen(this.points[i]);
            }
            if(pointsPix[1] - adder < 0) this.moveCamera[1] += 0.01;
            // while(pointsPix[0] < 0 || pointsPix[0] > this.html.width) {
            //     this.moveCamera[0]+=0.1;
            //     pointsPix = this.realPointToScreen(this.points[i]);
            // }

            if (pointsPix[0] + adder > this.html.width) this.moveCamera[0] -= 0.01;
            if (pointsPix[1] + adder > this.html.height) this.moveCamera[1] -= 0.01;
            //if (pointsPix[1] - adder < 0) this.moveCamera[1] += 0.01;
            //if (pointsPix[0] - adder < 0) this.moveCamera[0] += 0.01;

            if (this.points[i + 1]) {
                this.drawLineHTML(
                    this.points[i][0], this.points[i][1],
                    this.points[i + 1][0], this.points[i + 1][1]
                );
                this.drawLineHTML(
                    this.points[this.points.length - 1]?.[0], this.points[this.points.length - 1]?.[1] - 1,
                    this.points[this.points.length - 1]?.[0], this.points[this.points.length - 1]?.[1] + 1, "rgb(105, 124, 187)"
                )
                // let factor = 100;
                // for (let i = 0; i < this.points.length / factor; i += 1) {
                //     this.drawLineHTML(
                //         this.points[i * factor]?.[0], this.points[i * factor]?.[1] - 10,
                //         this.points[i * factor]?.[0], this.points[i * factor]?.[1] + 10
                //     )
                // }
                //console.log('w')
            }
            //console.log(this.points)
        }

        //drawLine([10, this.html.height - 10], [this.html.width - 10, this.html.height - 10], this.ctx);
        //drawLine([10, this.html.height - 10], [10, 10], this.ctx);
    }
    graphPoints(x, y) {
        this.points.push([x, y]);
    }
    /**
     * REAL/DATA POINTS
     */
    drawLineHTML(x1, y1, x2, y2, color="rgb(255,0,0)") {
        let screen1 = this.realPointToScreen([x1, y1]) //converts data points to screen points for drawing
        let screen2 = this.realPointToScreen([x2, y2])
        //console.log(screen1, screen2)
        color = `hsl(${this.moveCamera[0]},100%,50%)`;
        //if (!this.ctx) return;
        drawLine([screen1[0], screen1[1]], [screen2[0], screen2[1]], this.ctx, color)
    }
}

function time() {
    return (new Date()).getMilliseconds();
}

// let t = 0;
// let m = 0;

// new Graph(() => {
//     t += 0.1; m += 0.05;
//     return m;
// }, () => {
//     return Math.sin(t - m);
// }, [100, 100])

// new Graph(() => {
//     //t += 0.1; m += 0.05;
//     return Math.cos(t)-Math.sin(m);
// }, () => {
//     return Math.sin(t)+Math.cos(m);
// }, [200, 200])

console.log(Graph.all)

let movement = false;
let element = null;
/**
 * @type Graph
 */
let graph = null;
let x = 0, y = 0;
// document.addEventListener("click",(e)=>{
//     if(element) element = null;
//     if(movement) movement = false;
// })
let graphs = document.querySelectorAll(".graph")

addEventListener('keypress', (e) => {
    if (movement) {
        switch (e.key) {
            case "s":
                graph.max[1] += 1;
                break;
            case "w":
                //graph.max[1] -= 1;
                break;
            case "a":
                graph.max[0] += 1;
                break;
            case "d":
                //graph.max[0] -= 1;
                break;
        }
    }
})

let past = [0, 0]
document.addEventListener("mousemove", (e) => {
    if (movement) element.style.transform = `translateY(${graph.screenPos[1] += e.clientY - past[1]}px) translate(${graph.screenPos[0] += e.clientX - past[0]}px) scaleY(-1)`;
    past = [e.x, e.y]
})

export { Graph, movement }