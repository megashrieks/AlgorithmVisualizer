import { Node, VArray } from './UserClasses/'

let board = [[""]]
let fake = [[]]
let v = null, repr, cleanup = [];
let show;
let highlight = [];

const run = async ({ input, repr: r, show: s }) => {
    repr = r;
    repr.stop_execution();
    repr.clear_queue();
    show = s;
    cleanup.forEach(e => e && e.release());
    cleanup = [];
    const [{value:size}] = await input(Node, 1);
    board = [];
    for (let i = 0; i < size; ++i){
        let temp = [];
        for (let j = 0; j < size; ++j) temp.push("");
        board.push(temp);
    }
    fake = JSON.parse(JSON.stringify(board));
    v = new VArray(repr, {
        value: board,
    });
    v.value = board;
    NQueen(board, 0, size);
    cleanup.push(v);
    show(() => v.release());
}

const NQueen = (prev, col, size) => {
    for (let i = 0; i < size; ++i){
        prev[i][col] = 1;
        v.highlight(i, col);
        highlight.push({row:i,col})
        // v.value = prev;
        if (valid(prev, i, col, size)) {
            if (col + 1 != size)
                NQueen(prev, col + 1, size);
            else {
                let temp = new VArray(repr, { value: fake, show: false });
                for (let i in highlight) temp.highlight(highlight[i].row, highlight[i].col);
                cleanup.push(temp);
                show(() => {
                    temp.show();
                });
            }
        }
        prev[i][col] = "";
        v.remove_highlight(i, col);
        highlight.pop();
        // v.value = prev;
    }
    return false;
}
const valid = (current, row, col, size) => {
    for (let i = row-1, j = col-1; i >= 0 && j >= 0; i--, j--)
        if (current[i][j] == 1) return false;
    
    for (let i = row+1, j = col-1; i < size && j >= 0; i++, j--)
        if (current[i][j] == 1) return false;
    for (let i = col-1; i >= 0; i--)
        if (current[row][i] == 1) return false;
    return true;
}

// const DFS = (node, edge) => {
//     v.clear_highlight();
//     while (visited.length < node.id) { visited.push(-1); }
//     if (visited[node.id-1] != -1) return;
//     if (edge) edge.highlight();
//     repr.start_group();
//         v.value = visited;
//         node.highlight();
//         visited[node.id-1] = 1;
//         v.value = visited;
//         v.highlight(node.id-1);
//     repr.end_group();
//     node.adjacent.forEach((element, index) => {
//         DFS(element, node.edges[index]);
//     });
//     node.highlight(false);
//     if (edge) edge.highlight(false);
// }

export { run };