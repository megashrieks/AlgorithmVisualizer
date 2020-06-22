import { Node, VArray } from './UserClasses/'

let visited = [-1];
let v,repr;
const run = async ({ input, repr: r }) => {
    repr = r;
    if (v) v.release();
    visited = [-1];
    v = new VArray(repr, {
        value: visited,
    });
    const [start_node] = await input(Node, 1);
    DFS(start_node);
}

const DFS = (node, edge) => {
    v.clear_highlight();
    while (visited.length < node.id) { visited.push(-1); }
    v.value = visited;
    if (visited[node.id-1] != -1) return;
    if (edge) edge.highlight();
    repr.start_group();
        node.highlight();
        visited[node.id-1] = 1;
        v.value = visited;
        v.highlight(node.id-1);
    repr.end_group();
    node.adjacent.forEach((element, index) => {
        DFS(element, node.edges[index]);
    });
    node.highlight(false);
    if (edge) edge.highlight(false);
}

export { run };