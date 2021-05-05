export default class Render {
    constructor(root, simulator) {
        this.root = root;
        this.simulator = simulator;
    }

    initView() {
        $(root).empty();
        let x = 50;
        let y = 100;
        this.drawNode(this.simulator.getSource(), x, y);
        this.simulator.getPeers().forEach((node) => {
            this.drawNode(node, x+=150, y+=getRandomInt(20,100));
        });
        this.drawNode(this.simulator.getSink(), x+=150, y+=getRandomInt(20,100));

        this.simulator.getLinks().forEach((edge) => {
            this.drawEdge(edge);
        });

        $(document).on("drag", $(root), (event) => {
            let targetNode = this.simulator.findPeer(event.target.id);
            let dragPosition = {
                x: parseInt($(event.target).css("left")),
                y: parseInt($(event.target).css("top")),
            };
            targetNode.setPosition(dragPosition);
            if(targetNode.getType() === "source") {
                let dnstreamEdgeID = `${targetNode.getID()}--${targetNode.getNext().getID()}`;
                this.repositionEdge($("#"+dnstreamEdgeID));
            } else if(targetNode.getType() === "sink") {
                let upstreamEdgeID = `${targetNode.getPrev().getID()}--${targetNode.getID()}`;
                this.repositionEdge($("#"+upstreamEdgeID));
            } else {
                let upstreamEdgeID = `${targetNode.getPrev().getID()}--${targetNode.getID()}`;
                let dnstreamEdgeID = `${targetNode.getID()}--${targetNode.getNext().getID()}`;
                this.repositionEdge($("#"+upstreamEdgeID));
                this.repositionEdge($("#"+dnstreamEdgeID));
            };
        })
    }

    drawNode(node, x, y) {
        node.setPosition({x: x, y: y});
        let html = $($.parseHTML(`
            <div id="${node.getID()}" class="node ${node.getType()}">
                ${node.getID()}
            </div>
        `));
        if(node.getType() === "source") {
            html.attr("data-next", node.getNext().getID());
        } else if(node.getType() === "sink") {
            html.attr("data-prev", node.getPrev().getID());
        } else {
            html.attr("data-prev", node.getPrev().getID());
            html.attr("data-next", node.getNext().getID());
        };
        html.css("left", x);
        html.css("top", y);
        $(root).append(html);
        $(".node").draggable();
    }

    drawEdge(edge) {
        $("#"+edge.getID()).remove();
        let html = $($.parseHTML(`
            <div id="${edge.getID()}" class="edge">
                <div class="edgeStretcher"></div>
                <div class="edgeLabel">${edge.getBandwidth()}</div>
            </div>
        `));
        html.attr("data-source", edge.getSource().getID());
        html.attr("data-target", edge.getTarget().getID());
        $(root).append(html);
        this.repositionEdge($("#"+edge.getID()));
    }

    repositionEdge(edgeHTML) {
        let source = this.simulator.findPeer(edgeHTML.attr("data-source"));
        let target = this.simulator.findPeer(edgeHTML.attr("data-target"));
        let sourcePos = source.getPosition();
        let targetPos = target.getPosition();
        let midPoint = {
            x: (sourcePos.x + targetPos.x)/2,
            y: (sourcePos.y + targetPos.y)/2,
        }
        let distance = Math.sqrt((targetPos.x - sourcePos.x)**2+(targetPos.y - sourcePos.y)**2);
        let angle = Math.atan2(sourcePos.y - targetPos.y, sourcePos.x - targetPos.x) * 180 / Math.PI;
        edgeHTML.css("left", midPoint.x);
        edgeHTML.css("top", midPoint.y);
        edgeHTML.find(".edgeStretcher").css("width", distance);
        edgeHTML.find(".edgeStretcher").css("transform", `rotate(${angle}deg)`);
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}