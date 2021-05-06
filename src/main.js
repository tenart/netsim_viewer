import Node from "./node.js";
import Simulator from "./simulator.js"
import View from "./view.js";

// Reference to simulator engine
const simulator = new Simulator({
    timeStart: 0, 
    timeEnd: 1000
});

// Reference to GUI resources
const root = document.getElementById("root");
const view = new View(simulator, root);

// Manually adding Node() objects for testing
const server = new Node();
const clientA = new Node();
const clientB = new Node();
const clientC = new Node();
const clientD = new Node();
server.type = "source";
clientA.type = "peer";
clientB.type = "peer";
clientC.type = "peer";
clientD.type = "sink";
simulator.addNode(server);
simulator.addNode(clientA);
simulator.addNode(clientB);
simulator.addNode(clientC);
simulator.addNode(clientD);

// Initialize GUI

// What should the simulator do when starting?
simulator.onStart(() => {
    server.sendMessage(clientA, {size: 500000});
    view.init();
})

// What should the simulator do when stepping?
simulator.onStep(() => {
    if(simulator.time === 10) {
        clientC.sendMessage(clientB, {size: 100000});
    }
    view.update();
})

// Manually start and step simulator for testing
simulator.start();

document.getElementById("stepButton").addEventListener("click", event => {
    simulator.step(1);
})

// setInterval(() => {
//     simulator.step(1);
// }, 1000)


