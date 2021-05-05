import Node from "./node.js";
import Edge from "./edge.js";

export default class Simulator {
    constructor() {
        this.source = new Node({type: "source", id: "Source"});
        this.sink = new Node({type: "sink", id: "Sink"});
        this.peers = [];
        this.links = [];
    }

    addPeer(options) {
        let newPeer = new Node(options);
        this.peers.push(newPeer);
    }

    removePeer() {
        // TODO
    }

    getPeers() {
        return this.peers;
    }

    findPeer(id) {
        let result;
        if(id === this.source.getID()) {
            result = this.source;
        } else if(id === this.sink.getID()) {
            result = this.sink;
        } else {
            for(let i = 0; i < this.peers.length; i++) {
                if(this.peers[i].getID() === id) {
                    result = this.peers[i];
                    break;
                };
            };
        };
        return result;
    }

    findLink(id) {
        let result;
        for(let i = 0; i < this.links.length; i++) {
            if(this.links[i].getID() === id) {
                result = this.links[i];
                break;
            };
        };
        return result;
    }

    setSource(peer) {
        this.source = peer;
    }

    getSource() {
        return this.source;
    }

    setSink(peer) {
        this.source = peer;
    }

    getSink() {
        return this.sink;
    }
    
    startStrand() {
        if(this.peers.length === 0)  {
            // If there are no peers:
            // source --> sink
            this.linkNodes(this.source, this.sink);
        } else {
            // If there is at least 1 peer:
            // source --> peers[first]
            this.linkNodes(this.source, this.peers[0]);
            this.peers.forEach((node, i) => {
                if(i < this.peers.length-1) {
                    // If not last node in line:
                    // peers[i] --> peers[i+1]
                    this.linkNodes(node, this.peers[i+1]);
                } else {
                    // If last node in line
                    // peers[last] --> sink
                    this.linkNodes(this.peers[this.peers.length-1], this.sink);
                };
            });
        };
    }

    linkNodes(nodeA, nodeB, flag) {
        nodeA.setNext(nodeB);
        nodeB.setPrev(nodeA);
        let newLink = new Edge({source: nodeA, target: nodeB, bandwidth: 1});
        this.links.push(newLink);
    }

    getLinks() {
        return this.links;
    }

    popLink() {
        this.links.pop();
    }
}