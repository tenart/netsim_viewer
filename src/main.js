import Node from "./node.js";
import Simulator from "./simulator.js"
import View from "./view.js";

// Reference to simulator engine
const simulation = new Simulator({
    timeStart: 0, 
    timeEnd: 1000
});

// Reference to GUI resources
const root = document.getElementById("root");
const view = new View(simulation, root);

// Manually adding Node() objects for testing
const server = new Node();
const clientA = new Node();
const clientB = new Node();
simulation.addNode(server);
simulation.addNode(clientA);
simulation.addNode(clientB);

// Initialize GUI
view.init();

// What should the simulator do when starting?
simulation.onStart(() => {
    console.log("HELLO WORLD");
    server.sendMessage(clientA, {size: 30000});
})

// What should the simulator do when stepping?
simulation.onStep(() => {

})

// Manually start and step simulation for testing
simulation.start();
simulation.step(1);