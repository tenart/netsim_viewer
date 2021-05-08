import Node from "./node.js";
import Simulator from "./simulator.js"
import View from "./view.js";

// NOTE MAIN JS NOW IMPLEMENTS THE BROADCAST SIMULATION.
// THE BROADCAST FILE REFERENCES THIS FILE. CAN EASILY CHANGE IF NEEDED

// npx browser-sync start -sw

// Reference to simulator engine
let simulator = new Simulator({
    timeStart: 0,
    timeEnd: 500
});

// Reference to GUI resources
const root = document.getElementById("root");
const timeline = document.getElementById("timeline");
const view = new View(simulator, root, timeline);

// BROADCAST
const sender = new Node();
const broadcaster = new Node();
const peers = [];

for(let i = 0; i < 10 ; i++) {
    let node = new Node();
    console.log(node.speed.down);
    console.log(node.speed.up);
    node.type = "peer";
    peers.push(node);
    simulator.addNode(node);
}

sender.type = "source";
broadcaster.type = "sink";
broadcaster.speed.up = 300;
broadcaster.speed.down = 300;
sender.speed.up = 300;
simulator.addNode(sender);
simulator.addNode(broadcaster);

simulator.onStart(() => {
    sender.send(broadcaster, 1000000);
    view.init();
})

simulator.onStep(() => {
    view.update();
})

broadcaster.onReceive(message => {
    peers.forEach(peer => {
        broadcaster.send(peer, message.size, message.time.arrive);
    })
})

// BROADCAST ENDS HERE

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