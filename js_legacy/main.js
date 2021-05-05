import Simulator from "./simulator.js";
import Render from "./render.js"

function start() {
    
};

$(function() {
    // start();  
    const strandCast = new Simulator();
    const view = new Render($("#root"), strandCast);

    // strandCast.addPeer({type: "peer", id: String(getRandomInt(1000,9999))});
    // strandCast.addPeer({type: "peer", id: String(getRandomInt(1000,9999))});
    // strandCast.addPeer({type: "peer", id: String(getRandomInt(1000,9999))});
    // strandCast.addPeer({type: "peer", id: "Peer_D"});
    // strandCast.addPeer({type: "peer", id: "Peer_E"});
    // strandCast.addPeer({type: "peer", id: "Peer_F"});
    strandCast.startStrand();
    
    view.initView();

    console.log(strandCast.getSource().print()); 
    strandCast.getPeers().forEach((peer) => {
        console.log(peer.print());
    })
    console.log(strandCast.getSink().print()); 

    strandCast.getLinks().forEach((link) => {
        console.log(link.print());
    })

    $("button").click(() => {
        strandCast.addPeer({type: "peer", id: String(getRandomInt(1000,9999))});
        strandCast.popLink();
        strandCast.startStrand();
        view.initView();
        // alert("ADDING");
    })
    
});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}