import { utils } from "./utils.js";
import Message from "./message.js";

export default class Node {

    constructor(options) {
        // If no options passed in then use default preset
        options = options !== undefined ? options : this.default();
        // id:      int assigned when added to a simulation
        // parent:  reference to parent simulator, defined when added to a sim
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
            end: [],
            receive: []
        };
    }

    // Default values for quick setup
    default() {
        let preset = {
            name: utils.uuid(),
            type: undefined,
            speed: {
                up: parseInt(Math.random()*30) + 30,
                down: parseInt(Math.random()*30) + 50
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

    send(target, size, time) {
        time = time !== undefined ? time : this.parent.time;
        size = size !== undefined ? size : 8000
        let message = new Message(time, this, target, size);
        this.parent.schedule(message);
        console.log(`T${this.parent.time}: [${this.id}] >>>> [${message.to.id}]`);
        console.log(`T${this.parent.time}: [${this.id}] | size    ${message.size} bytes`);
        console.log(`T${this.parent.time}: [${this.id}] | sent_at ${message.time.sent}`);
        console.log(`T${this.parent.time}: [${this.id}] | t_delay ${message.time.arrive} ms`);
        console.log(`T${this.parent.time}: [${this.id}] | arrival ${message.time.arrive}`);

        // TEMP HTML MANIPULATION, MOVE TO VIEW LATER
        if (document.readyState === 'complete') {
            let timeline = document.getElementById("timeline");
            let marker = document.createElement("div");
            let percent = time / this.parent.timeEnd * 100;
            marker.classList.add("marker", "send", this.type);
            marker.style.left = `${percent}%`;
            timeline.appendChild(marker);

            let node = document.getElementById(this.id);
            let popup = document.createElement('div');
            popup.className = "popup";
            let newID = utils.uuid().toString();
            popup.id = newID;
            popup.innerHTML = `<span class="popuptext" id="myPopup">Sending ${message.size} bytes</span>`;
            node.append(popup);
            setTimeout(() => {
                document.getElementById(newID).remove();
            },2000);
        }
    }

    receive(message) {
        // console.log(`T${this.parent.time}: ${message.time.arrive}`);
        let shortTime = String(message.time.arrive).slice(0,8)
        console.log(`T${this.parent.time}: [${this.id}] <<<< [${message.from.id}]`);
        console.log(`T${this.parent.time}: [${this.id}] | size    ${message.size} bytes`);
        console.log(`T${this.parent.time}: [${this.id}] | sent_at ${message.time.sent}`);
        console.log(`T${this.parent.time}: [${this.id}] | t_delay ${message.time.arrive} ms`);
        console.log(`T${this.parent.time}: [${this.id}] | arrival ${message.time.arrive}`);
        this.callbacks.receive.forEach(callback => { callback(message) });

        // TEMP HTML
        let timeline = document.getElementById("timeline");
        let marker = document.createElement("div");
        let percent = message.time.arrive / this.parent.timeEnd * 100;
        marker.classList.add("marker", "receive", this.type);
        marker.style.left = `${percent}%`;
        timeline.appendChild(marker);

        let node = document.getElementById(this.id);
        let popup = document.createElement('div');
        popup.className = "popup";
        let newID = utils.uuid().toString();
        popup.id = newID;
        popup.innerHTML = `<span class="popuptext" id="myPopup">Received ${message.size} bytes</span>`;
        node.append(popup);
        setTimeout(() => {
            document.getElementById(newID).remove();
        },1000);
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

    onReceive(callback) {
        this.callbacks.receive.push(callback);
    }

}