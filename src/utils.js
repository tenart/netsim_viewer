export const utils =  {
    // Simple semi unique string
    // From W3C Resources
    uuid: () => {
        let dt = new Date().getTime();
        let pattern = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
        let uuid = pattern.replace(/[xy]/g, c => {
            let r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c === 'x' ? r : (r&0x3|0x8)).toString(16);
        })
        return uuid;
    },
    // r:   link speed in Mb/s
    // b:   file size in bytes
    // returns calculated delay in ms
    calcDelay: (r, b) => {
        let bits = b * 8;
        let delay = bits / (r * 1000000);
        console.log(`${bits} bits / ${r} Mbps = ${delay*1000} ms`);
        return delay * 1000;
    },
    // Return random {x: int, y: int} that is somewhere 
    // on the screen
    randomPos: () => {
        let margins = 0.2;
        let w = parseInt(Math.random() * (window.innerWidth * (1-margins)) + (window.innerWidth * margins/2));
        let h = parseInt(Math.random() * (window.innerHeight * (1-margins)) + (window.innerHeight * margins/2));
        return {x: w, y: h};
    },
    // Returns midpoint between two coords
    // rounded down nearest int
    getMidPoint: (a, b) => {
        let mid = {
            x: parseInt((a.x + b.x)/2),
            y: parseInt((a.y + b.y)/2)
        }
        return mid;
    },
    // Returns distance between two coords
    // rounted down nearest int
    getDistance: (a, b) => {
        let x = Math.pow(b.x - a.x, 2);
        let y = Math.pow(b.y - a.y, 2);
        let dist = parseInt(Math.sqrt(x+y));
        return dist;
    },
    // Returns angle between two coords
    // can be floats/doubles
    getAngle: (a, b) => {
        var deg = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
        return deg;
    }
} 