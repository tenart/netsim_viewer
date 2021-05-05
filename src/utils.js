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
        return delay * 1000;
    },
    // Return random {x: int, y: int} that is somewhere 
    // on the screen
    randomPos: () => {
        let margins = 0.2;
        let w = parseInt(Math.random() * (window.innerWidth * (1-margins)) + (window.innerWidth * margins/2));
        let h = parseInt(Math.random() * (window.innerHeight * (1-margins)) + (window.innerHeight * margins/2));
        return {x: w, y: h};
    }

} 