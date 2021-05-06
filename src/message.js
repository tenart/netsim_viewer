import { utils } from "./utils.js";

export default class Message {

    constructor(timeSent, from, to, size) {
        // timeSent is required
        // from is required
        // to is required
        // If no options passed in then use default preset
        this.id = utils.uuid();
        // Node() objects this message originated from / going to
        this.from = from;
        this.to = to;
        // size: message size in Bytes
        this.size = size !== undefined ? size : 8000;
        // Timing information
        this.time = {
            sent: timeSent,
            delayT: this._getDelayT(),
            arrive: timeSent + this._getDelayT(),
            progress: 0
        }
    }
    // Returns the smaller of the two speeds
    // in Mb/s
    getLinkSpeed() {
        let upSpeed = this.from.speed.up;
        let dnSpeed = this.to.speed.down;
        return Math.min(upSpeed, dnSpeed);
    }

    _getDelayT() {
        let delay = utils.calcDelay(this.getLinkSpeed(), this.size);
        return delay;
    }

}