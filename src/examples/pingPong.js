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
const timeline = document.getElementById("timeline");
const view = new View(simulator, root, timeline);

const nodeA = new Node();
const nodeB = new Node();

nodeA.type = "peer";
nodeB.type = "peer";
simulator.addNode(nodeA);
simulator.addNode(nodeB);

simulator.onStart(() => {
    nodeA.send(nodeB, 1000000);
    view.init();
})

simulator.onStep(() => {
    view.update();
})

nodeB.onReceive(message => {
    nodeB.send(nodeA, message.size, message.time.arrive);
})

nodeA.onReceive(message => {
    nodeA.send(nodeB, message.size, message.time.arrive);
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
    document.getElementById("resetButton").classList.add("disabled");
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
    document.getElementById("resetButton").classList.remove("disabled");
    document.getElementById("stopButton").classList.add("disabled");

    clearInterval(autoStep);
})

document.getElementById('resetButton').addEventListener('click',() => {
    window.location.reload();
})