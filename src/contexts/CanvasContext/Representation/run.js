import { GNode } from './GNode'
import { DEdge } from './DEdge'
import { UDEdge } from './UDEdge'
let show;
const run = async ({ input, show: s }) => {
    show = s;
    console.log("ENTER START NODE FOR DFS");
    const [start_node] = await input(GNode, 1);
    console.log("STARTING DFS FROM : ", start_node.id);
    DFS(start_node);
}

function DFS(node, edge) {
    show(() => {
        node.highlight = true;
        if (edge) {
            console.log(edge);
            edge.select();
        }
    });
    for (let index in node.adjacent_elements) {
        DFS(node.adjacent_elements[index].element, node.adjacent_elements[index].edge);
    }
    show(() => {
        node.highlight = false;
        if (edge) {
            console.log("unselect edge", edge);
            edge.unselect();
        }
    });
}

export { run };