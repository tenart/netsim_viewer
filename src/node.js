import { utils } from "./utils.js";
import Message from "./message.js";

export default class Node {

    constructor(options) {
        // If no options passed in then use default preset
        options = options !== undefined ? options : this.default();
        // id:      int assigned when added to a simulation
        // parent:  reference to parent simulator
        this.id = undefined;
        this.parent = undefined;
        // name:    semi-unique string
        // type:    string for future use ("server", "client")
        this.name = options.name;
        this.type = options.type;
        // This node's capabilities in Mb/s
        this.speed = {
            up: options.speed.up,
            down: options.speed.down
        }
        // link:    other Node() objects this points to and from
        this.link = {
            to: options.link.to,
            from: options.link.from
        }
        // position:    this node's coords for UI purposes 
        //              (and maybe prop. delay)
        this.position = {
            x: options.position.x,
            y: options.position.y
        }
        // callbacks:   any functions this node should call
        this.callbacks = {
            start: [],
            step: [],
            end: []
        };
    }

    // Default values for quick setup
    default() {
        let preset = {
            name: utils.uuid(),
            type: undefined,
            speed: {
                up: 55,
                down: 85
            },
            link: {
                to: undefined,
                fom: undefined
            },
            position: {
                x: utils.randomPos().x,
                y: utils.randomPos().y
            }
        }
        return preset;
    }

    sendMessage(target, size) {
        let message = new Message(this.parent.time, this, target, size);
        this.parent.schedule(message);
    }

    start() {
        this.callbacks.start.forEach(callback => { callback() });
    }

    step() {
        this.callbacks.step.forEach(callback => { callback() });
    }

    stop() {
        this.callbacks.stop.forEach(callback => { callback() });
    }

    onStart(callback) {
        this.callbacks.start.push(callback);
    }

    onStep(callback) {
        this.callbacks.step.push(callback);
    }

    onStop(callback) {
        this.callbacks.stop.push(callback);
    }

}