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
        message.id = this.scheduled.length + 1;
        this.scheduled.push(message);
        console.log(`T${this.time}: [${message.from.id}] -> [${message.to.id}] sending ${message.size} bytes, arriving at ${message.time.arrive}.`);
    }
    
    // Start simulation but not step automatically
    start() {
        // TODO
        console.log(`T${this.time}: Starting ...`);
        this.nodes.forEach(node => { node.start() });
        this.callbacks.start.forEach(callback => { callback() });
    }

    // Step simulation forward one step (1 ms) by default
    step(skip) {
        skip = skip !== undefined ? skip : 1;
        this.time += skip !== undefined ? skip : 1;
        console.log(`T${this.time}: Stepping time += ${skip} ...`);
        this.nodes.forEach(node => { node.step() });
        this.callbacks.step.forEach(callback => { callback() });
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

}