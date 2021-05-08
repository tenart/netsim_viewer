import Simulator from "../simulator.js";
import View from "../view.js";
import Node from "../node.js";
import { utils } from "../utils.js";

// Reference to simulator engine
let simulator = new Simulator({
    timeStart: 0,
    timeEnd: 800
});

// Reference to GUI resources
const root = document.getElementById("root");
const tools = document.getElementById("tools");
const view = new View(simulator, root, tools);
const clientA = new Node();
const clientB = new Node();

clientA.type = "green";
clientA.position.x = utils.screenCenter().x + utils.screenCenter().x / 2;
clientA.position.y = utils.screenCenter().y - utils.screenCenter().y / 4;
clientB.type = "purple";
clientB.position.x = utils.screenCenter().x - utils.screenCenter().x / 2;
clientB.position.y = utils.screenCenter().y + utils.screenCenter().y / 4;

simulator.addNode(clientA);
simulator.addNode(clientB);

// Simulation callbacks
// What should the simulator do when starting?
simulator.onStart(() => {
    clientB.send(clientA, 40000, simulator.time);
    // Always need to initialize view
    view.init();
})

// What should the simulator do when stepping?
simulator.onStep(() => {
    view.update();
})

clientA.onReceive(message => {
    clientA.send(clientB, 1000, message.time.arrive);
})

clientB.onReceive(message => {
    clientB.send(clientA, 40000, message.time.arrive);
})

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