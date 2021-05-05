import { utils } from "./utils.js";

export default class Message {

    constructor(timeSent, from, to, options) {
        // timeSent is required
        // from is required
        // to is required
        // If no options passed in then use default preset
        options = options !== undefined ? options : this.default();
        this.id = undefined;
        // Node() objects this message originated from / going to
        this.from = from;
        this.to = to;
        // size:    message size in Bytes
        this.size = options.size;
        // Timing information
        this.time = {
            sent: timeSent,
            delayT: this._getDelayT(),
            arrive: timeSent + this._getDelayT(),
            progress: 0
        }
    }

    // Default values for quick setup
    default() {
        let preset = {
            size: 8000,
        }
        return preset;
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