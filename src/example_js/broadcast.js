import Simulator from "../simulator.js";
import View from "../view.js";
import Node from "../node.js";
import { utils } from "../utils.js";

// Reference to simulator engine
let simulator = new Simulator({
    timeStart: 0,
    timeEnd: 250
});

// Reference to GUI resources
const root = document.getElementById("root");
const tools = document.getElementById("tools");
const view = new View(simulator, root, tools);

const source = new Node();
const broadcaster = new Node();
source.type = "purple";
source.speed = {up: 300, down: 300};
source.position = utils.screenCenter();
source.position.y += 200;
broadcaster.type = "blue";
broadcaster.speed = {up: 300, down: 300};
broadcaster.position = utils.screenCenter();
simulator.addNode(source);
simulator.addNode(broadcaster);

const clients = [];
for(let i = 0; i < 13; i++) {
    let colors = ["red", "orange", "yellow"];
    let randColor = colors[parseInt(Math.random() * colors.length)];
    let node = new Node();
    node.type = randColor;
    let angle = Math.random() * 360;
    let distance = Math.random() * 50 + 150;
    node.position = utils.pointAngleDistance(utils.screenCenter(), angle, distance);
    clients.push(node);
    simulator.addNode(node);
}



// Simulation callbacks
// What should the simulator do when starting?
simulator.onStart(() => {
    source.send(broadcaster, 1000000, simulator.time);
    // Always need to initialize view
    view.init();
})

// What should the simulator do when stepping?
simulator.onStep(() => {
    view.update();
})

broadcaster.onReceive(message => {
    clients.forEach(client => {
        broadcaster.send(client, message.size, message.time.arrive);
    })
})

// // What should the simulator do when stepping?
// simulator.onStep(() => {
//     view.update();
// })

// clients.forEach(node => {
//     node.onReceive(message => {
//         let rand = parseInt(Math.random() * node.parent.nodes.length);
//         let randomPeer = node.parent.nodes[rand];
//         while(randomPeer === node) {
//             rand = parseInt(Math.random() * node.parent.nodes.length);
//             randomPeer = node.parent.nodes[rand];
//         }
//         node.send(randomPeer, message.size, message.time.arrive);
//     })
// })

// Manually init simulator for testing
simulator.init();

// Temp buttons
document.getElementById("stepButton").addEventListener("click", event => {
    simulator.step(1);
})

let autoStep;
let isAutoStepping = false;
let autoInterval = 200;

document.getElementById("autoButton").addEventListener("click", event => {
    document.getElementById("autoButton").classList.add("disabled");
    document.getElementById("stepButton").classList.add("disabled");
    document.getElementById("resetButton").classList.add("disabled");
    document.getElementById("stopButton").classList.remove("disabled");

    autoStep = setInterval(() => {
        if(simulator.time < simulator.timeEnd) {
            isAutoStepping = true;
            simulator.step(1);
        } else {
            clearInterval(autoStep);
            isAutoStepping = false;
            document.getElementById("resetButton").classList.remove("disabled");
            document.getElementById("stopButton").classList.add("disabled");
        }
    }, autoInterval)
})

document.getElementById("stopButton").addEventListener("click", event => {
    document.getElementById("autoButton").classList.remove("disabled");
    document.getElementById("stepButton").classList.remove("disabled");
    document.getElementById("resetButton").classList.remove("disabled");
    document.getElementById("stopButton").classList.add("disabled");

    clearInterval(autoStep);
    isAutoStepping = false;
})

document.getElementById('resetButton').addEventListener('click',() => {
    window.location.reload();
})

$("#speed_handle").draggable({
    containment: "parent",
    axis: "x"
});

$("#speed_handle").on("drag", event => {
    clearInterval(autoStep);
    let handle = $(event.target);
    let factor = 1-(parseInt(handle.css("left"))/132);
    autoInterval = 1000 * factor;
    if(isAutoStepping) {
        autoStep = autoStep = setInterval(() => {
            if(simulator.time < simulator.timeEnd) {
                isAutoStepping = true;
                simulator.step(1);
            } else {
                clearInterval(autoStep);
                isAutoStepping = false;
                document.getElementById("resetButton").classList.remove("disabled");
                document.getElementById("stopButton").classList.add("disabled");
            }
        }, autoInterval);
    }
})