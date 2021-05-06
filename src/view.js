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
        let links = document.getElementsByClassName("link");
        Array.from(links).forEach(link => {
            link.remove();
        })
        this.simulator.scheduled.forEach(message => {
            let html = this._messageToHTML(message);
            this.root.appendChild(html);
        })
        // document.getElementById("stepButton").innerHTML = this.simulator.time;
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
        label.innerHTML = Math.round(message.time.progress*100);
        progressFill.style.width = `${message.time.progress * 100}%`;
        progressFill.classList.add("progressFill");
        progressBar.classList.add("progress");
        progressBar.appendChild(progressFill);
        progressBar.style.width = `${dist}px`;
        progressBar.style.transform = `rotate(${angle}deg)`;
        container.appendChild(progressBar);
        container.appendChild(label)
        container.id = `msg_${message.id}`;
        container.classList.add("link");
        container.setAttribute("node_from", message.from.id);
        container.setAttribute("node_to", message.to.id);
        container.style.top = `${mid.y}px`;
        container.style.left = `${mid.x}px`;
        return container;
    }

    _updateLinks() {
        let links = document.getElementsByClassName("link");
        Array.from(links).forEach(link => {
            // console.log(link.getAttribute("node_to"));
            let fromID = parseInt(link.getAttribute("node_from"));
            let toID = parseInt(link.getAttribute("node_to"));
            let fromPos = this.simulator.nodes[fromID-1].position;
            let toPos = this.simulator.nodes[toID-1].position;
            let mid = utils.getMidPoint(fromPos, toPos);
            let dist = utils.getDistance(fromPos, toPos);
            let angle = utils.getAngle(fromPos, toPos);
            link.style.top = `${mid.y}px`;
            link.style.left = `${mid.x}px`;
            let progress = link.querySelector(".progress");
            progress.style.width = `${dist}px`;
            progress.style.transform = `rotate(${angle}deg)`;
        })
    }
    
    _updateDrag(id, pos) {
        for(let i = 0; i < this.simulator.nodes.length; i++) {
            if(this.simulator.nodes[i].id === id) {
                this.simulator.nodes[i].position.x = pos.x;
                this.simulator.nodes[i].position.y = pos.y;
                break;
            }
        }
        this._updateLinks();
    }

}