import { Node } from './UserClasses/'
const run = async ({ input }) => {
    const [start_node] = await input(Node, 1);
    console.log("starting");
    DFS(start_node);
}

const DFS = (node, edge) => {
    if (edge) edge.highlight();
    node.highlight();
    node.adjacent.forEach((element, index) => {
        DFS(element, node.edges[index]);
    });
    node.highlight(false);
    if (edge) edge.highlight(false);
}

export { run };