export default class View {

    constructor(simulator, root) {
        this.model = simulator;
        this.root = root;
    }

    init() {
        this.model.nodes.forEach(node => {
            let html = this._nodeToHTML(node);
            this.root.appendChild(html);
        })
    }

    _nodeToHTML(node) {
        let container = document.createElement("div");
        let label = document.createElement("div");
        label.classList.add("label");
        label.innerHTML = node.name;
        container.appendChild(label);
        container.id = node.id;
        container.classList.add("node");
        container.style.top = `${node.position.y}px`;
        container.style.left = `${node.position.x}px`;
        return container;
    }
    
}