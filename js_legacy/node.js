export default class Node {
    constructor(options) {
        this.type = options.type;
        this.id = options.id;
        this.next;
        this.prev;
        this.upBandwidth;
        this.dnBandwidth;
        this.position = {
            x: 0,
            y: 0,
        }
    }

    getID() {
        return this.id;
    }

    print() {
        let prev = (this.prev === undefined)? "[X]":`[${this.prev.getID()}]`;
        let next = (this.next === undefined)? "[X]":`[${this.next.getID()}]`;
        let string = `${prev} >> [${this.id}] >> ${next}`;
        return string;
    }

    getType() {
        return this.type;
    }

    setNext(node) {
        this.next = node;
    }

    getNext() {
        return this.next;
    }

    setPrev(node) {
        this.prev = node;
    }

    getPrev() {
        return this.prev;
    }

    getPosition() {
        return this.position;
    }

    setPosition(position) {
        this.position.x = position.x;
        this.position.y = position.y;
    }
}