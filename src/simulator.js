export default class Simulator {
    constructor(options) {
        // If no options passed in then use default preset
        options = options !== undefined ? options : this.default();
        // Array of nodes in this simulation
        this.nodes = [];
        // Time to start and end simulation in ms
        this.time = options.timeStart;
        this.timeEnd = options.timeEnd;
        // List of Message() objects to deliver over time
        // buffer is to keep new messages entering in between steps
        this.buffer = [];
        this.scheduled = [];
        // callbacks:   any functions this system should call
        this.callbacks = {
            start: [],
            step: [],
            end: []
        };
    }

    // Default values for quick setup
    default() {
        let preset = {
            time: 0,
            timeEnd: 1000
        }
        return preset;
    }

    // Add a Node() object to this simulation
    // and update that node's id
    addNode(node) {
        node.id = this.nodes.length + 1;
        node.parent = this;
        this.nodes.push(node);
        console.log(`T${this.time}: Added node [${node.id}] ${node.name} to system.`);
    }

    schedule(message) {
        // message.id = this.scheduled.length + 1;
        this.buffer.push(message);
    }
    
    // Start simulation but not step automatically
    init() {
        // TODO
        console.log(`T${this.time}: Starting ...`);
        this.nodes.forEach(node => { node.start() });
        this.callbacks.start.forEach(callback => { callback() });
    }

    // Step simulation forward one step (1 ms) by default
    step(skip) {
        if(this.time < this.timeEnd) {
            skip = skip !== undefined ? skip : 1;
            this.time += skip !== undefined ? skip : 1;
            this._serviceMessages();
            this.scheduled = this.scheduled.concat(this.buffer);
            this.buffer = [];
            this.nodes.forEach(node => { node.step() });
            this.callbacks.step.forEach(callback => { callback() });
            console.log(`T${this.time}:`);
        }
    }

    stop() {
        this.nodes.forEach(node => { node.stop() });
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

    _serviceMessages() {
        let toDeliver = [];
        this.scheduled.forEach(message => {
            message.time.progress = (this.time - message.time.sent)/(message.time.arrive - message.time.sent);
            if(this.time >= message.time.arrive) {
                let msgIndex = this.scheduled.indexOf(message);
                toDeliver.push(message);
            }
        })
        let toKeep = [];
        this.scheduled.forEach((message) => {
            if(!toDeliver.includes(message)) {
                toKeep.push(message);
            }
        })
        toDeliver.forEach(message => {
            message.to.receive(message);
        })
        this.scheduled = toKeep;
    }

}