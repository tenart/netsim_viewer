import { utils } from "./utils.js";

export default class View {

    constructor(simulator, root) {
        this.simulator = simulator;
        this.root = root;
    }

    init() {
        $(this.root).empty();
        this.simulator.nodes.forEach(node => {
            let html = this._nodeToHTML(node);
            this.root.appendChild(html);
        })
        this.simulator.scheduled.forEach(message => {
            let html = this._messageToHTML(message);
            this.root.appendChild(html);
        })
        $(".node").draggable();
        $(this.root).on("drag", (event) => {
            let id = parseInt(event.target.id);
            let pos = {
                x: parseInt(event.target.style.left),
                y: parseInt(event.target.style.top)
            }
            this._updateDrag(id, pos);
        })
    }

    update() {
        // this.simulator.nodes.forEach(node => {
        //     let html = document.getElementById(node.id);
        // })
        $(root).find(".link").remove();
        this.simulator.scheduled.forEach(message => {
            let html = this._messageToHTML(message);
            this.root.appendChild(html);
        })
    }

    _nodeToHTML(node) {
        let container = document.createElement("div");
        let label = document.createElement("div");
        label.classList.add("label");
        label.innerHTML = node.name;
        container.innerHTML = node.id;
        container.appendChild(label);
        container.id = node.id;
        container.classList.add("node");
        container.classList.add(node.type);
        container.style.top = `${node.position.y}px`;
        container.style.left = `${node.position.x}px`;
        return container;
    }

    _messageToHTML(message) {
        let fromPos = message.from.position;
        let toPos = message.to.position;
        let mid = utils.getMidPoint(fromPos, toPos);
        let dist = utils.getDistance(fromPos, toPos);
        let angle = utils.getAngle(fromPos, toPos);
        let container = document.createElement("div");
        let progressBar = document.createElement("div");
        let progressFill = document.createElement("div");
        let label = document.createElement("div");
        label.classList.add("label");
        label.innerHTML = message.id;
        progressFill.classList.add("progresFill");
        progressBar.classList.add("progress");
        progressBar.appendChild(progressFill);
        progressBar.style.width = `${dist}px`;
        progressBar.style.transform = `rotate(${angle}deg)`;
        container.appendChild(progressBar);
        container.appendChild(label)
        container.classList.add("link");
        container.id = `msg_${message.id}`;
        container.setAttribute("node-from", message.from.id);
        container.setAttribute("node-to", message.to.id);
        container.style.top = `${mid.y}px`;
        container.style.left = `${mid.x}px`;
        return container;
    }
    
    _updateDrag(id, pos) {
        this.simulator.nodes[id-1].position.x = pos.x;
        this.simulator.nodes[id-1].position.y = pos.y;
    }

}