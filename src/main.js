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
const clientE = new Node();
const clientF = new Node();
const clientG = new Node();
const clientH = new Node();
server.type = "source";
clientA.type = "peer";
clientB.type = "peer";
clientC.type = "peer";
clientD.type = "peer";
clientE.type = "peer";
clientF.type = "peer";
clientG.type = "peer";
clientH.type = "sink";
simulator.addNode(server);
simulator.addNode(clientA);
simulator.addNode(clientB);
simulator.addNode(clientC);
simulator.addNode(clientD);
simulator.addNode(clientE);
simulator.addNode(clientF);
simulator.addNode(clientG);
simulator.addNode(clientH);

// Simulation callbacks
// What should the simulator do when starting?
simulator.onStart(() => {
    server.send(clientA, 50000);
    server.send(clientE, 92000);
    // Always need to initialize view
    view.init();
})

// What should the simulator do when stepping?
simulator.onStep(() => {
    // if(simulator.time === 10) {
    //     clientC.send(clientB, {size: 100000});
    // }
    // Always update the view after a step
    view.update();
})

// Node callbacks
clientA.onReceive(message => {
    clientA.send(clientC, 69000, message.time.arrive);
})

clientC.onReceive(message => {
    clientC.send(clientB, 75000, message.time.arrive);
})

clientB.onReceive(message => {
    clientB.send(clientD, 81000, message.time.arrive);
})

clientD.onReceive(message => {
    clientD.send(clientA, 51000, message.time.arrive);
})

clientE.onReceive(message => {
    clientE.send(clientG, 120000, message.time.arrive);
})

clientG.onReceive(message => {
    clientG.send(clientF, 34000, message.time.arrive);
})

clientF.onReceive(message => {
    clientF.send(clientH, 28000, message.time.arrive);
})

clientH.onReceive(message => {
    clientH.send(clientE, 15000, message.time.arrive);
})

// Manually start and step simulator for testing
simulator.start();

document.getElementById("stepButton").addEventListener("click", event => {
    simulator.step(1);
})

let autoStep;

document.getElementById("autoButton").addEventListener("click", event => {
    document.getElementById("autoButton").classList.add("disabled");
    document.getElementById("stepButton").classList.add("disabled");
    document.getElementById("stopButton").classList.remove("disabled");
    
    autoStep = setInterval(() => {
        simulator.step(1);
    }, 100)
})

document.getElementById("stopButton").addEventListener("click", event => {
    document.getElementById("autoButton").classList.remove("disabled");
    document.getElementById("stepButton").classList.remove("disabled");
    document.getElementById("stopButton").classList.add("disabled");
    
    clearInterval(autoStep);
})




