import Simulator from "../simulator.js";
import View from "../view.js";
import Node from "../node.js";

// Reference to simulator engine
let simulator = new Simulator({
    timeStart: 0,
    timeEnd: 2000
});

// Reference to GUI resources
const root = document.getElementById("root");
const view = new View(simulator, root);

// DEFAULT
// Manually adding Node() objects for testing
const source = new Node();
const sink = new Node();
const clients = []
source.type = "source";
sink.type = "sink";
simulator.addNode(source);
simulator.addNode(sink);
for(let i = 0; i < 12; i++) {
    clients.push(new Node());
}
clients.forEach(node => {
    node.type = "peer";
    simulator.addNode(node);
})

// Simulation callbacks
// What should the simulator do when starting?
simulator.onStart(() => {
    source.send(clients[0], 50000, simulator.time);
    // server.send(clientB, 92000);
    // Always need to initialize view
    view.init();
})

// What should the simulator do when stepping?
simulator.onStep(() => {
    view.update();
})

// Node callbacks
clients.forEach(node => {
    node.onReceive(message => {
        let rand = parseInt(Math.random() * node.parent.nodes.length);
        let randomPeer = node.parent.nodes[rand];
        while(randomPeer === node) {
            rand = parseInt(Math.random() * node.parent.nodes.length);
            randomPeer = node.parent.nodes[rand];
        }
        node.send(randomPeer, message.size, message.time.arrive);
    })
})

sink.onReceive(message => {
    sink.send(clients[0], message.size, message.time.arrive);
})

source.onReceive(message => {
    sink.send(clients[0], message.size, message.time.arrive);
})

// Manually init simulator for testing
simulator.init();

// Temp buttons
document.getElementById("stepButton").addEventListener("click", event => {
    simulator.step(1);
})

let autoStep;

document.getElementById("autoButton").addEventListener("click", event => {
    document.getElementById("autoButton").classList.add("disabled");
    document.getElementById("stepButton").classList.add("disabled");
    document.getElementById("stopButton").classList.remove("disabled");

    autoStep = setInterval(() => {
        if(simulator.time < simulator.timeEnd) {
            simulator.step(1);
        } else {
            clearInterval(autoStep);
        }
    }, 100)
})

document.getElementById("stopButton").addEventListener("click", event => {
    document.getElementById("autoButton").classList.remove("disabled");
    document.getElementById("stepButton").classList.remove("disabled");
    document.getElementById("stopButton").classList.add("disabled");

    clearInterval(autoStep);
})