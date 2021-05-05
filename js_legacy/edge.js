export default class Edge {
    constructor(options) {
        this.bandwidth = options.bandwidth;
        this.source = options.source;
        this.target = options.target;
        this.id = `${this.source.getID()}--${this.target.getID()}`;
    }

    print() {
        let prev = (this.source === undefined)? "[X]":`[${this.source.getID()}]`;
        let next = (this.target === undefined)? "[X]":`[${this.target.getID()}]`;
        let string = `${prev} >--(${this.id})--> ${next}`;
        return string;
    }

    getID() {
        return this.id;
    }
    
    setSource(node) {
        this.source = node;
    }

    getSource() {
        return this.source;
    }

    setTarget(node) {
        this.target = node;
    }

    getTarget() {
        return this.target;
    }

    setBandwidth(bandwidth) {
        this.bandwidth = bandwidth;
    }

    getBandwidth() {
        return this.bandwidth;
    }
}