import { VArray } from './UserClasses/'
let playground;
let something = null;
const run = async ({ input, repr, show }) => {
    repr.clear_queue();
    let board = [["", "", ""], ["", "", ""], ["", "", ""]];
    if (something) { console.log("finish previous game");return;}
    playground = new VArray(repr, {
        value: board,
        measure: { x: 70, y: 70 }
    });
    something = 5;
    let count = 0;
    while (count++ < 5) {
        let [element] = await input(VArray, 1);
        if (element !== playground) {
            console.log("select the tictactoe area")
            continue;
        }
        let { row, col } = element.select_position;
        if (board[row][col] !== "") {
            console.log("Cell not empty");
            continue;
        }
        board[row][col] = "X"
        playground.value = board;
        let w = won(board);
        if (w !== -1) { break; }
        board = tictactoe(board,'O');
        playground.value = board;
        w = won(board);
        if (w !== -1) { break; }
        repr.start_execution();
    }
    something = null;
}
const tictactoe = (board,turn) => {
    let minloss = -Infinity, maxcoord = null;
    for (let i = 0; i < board.length; ++i) {
        for (let j = 0; j < board.length; ++j) {
            if (board[i][j] !== "") continue;
            board[i][j] = turn;
            let t = turn === 'X' ? 'O' : 'X';
            let temp = minimax(board, t,turn);
            if (temp > minloss) {
                minloss = temp;
                maxcoord = { x: i, y: j };
            }
            board[i][j] = '';
        }
    }
    if(maxcoord)
        board[maxcoord.x][maxcoord.y] = turn;
    return board;
}

const minimax = (board, turn, maxp) => {
    let wonb = won(board);
    if (wonb === maxp) return 1;
    else if (wonb !== -1) return -1;
    else {
        let flag = false;
        for (let i = 0; i < board.length; ++i) 
            for (let j = 0; j < board.length; ++j) 
                if (!board[i][j]) { flag = true; break; }
        if (!flag) return 0;
    }
    let wins = -Infinity, f = Math.max;
    if (turn !== maxp) {
        wins = Infinity;
        f = Math.min;
    }
    for (let i = 0; i < board.length; ++i){
        for (let j = 0; j < board.length; ++j){
            if (board[i][j] !== '') continue;
            board[i][j] = turn;
            let t = turn === 'X' ? 'O' : 'X';
            wins = f(wins, minimax(board, t, maxp));
            board[i][j] = '';
        }
    }
    return wins
}

const won = board => {
    let positions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (let i in positions) {
        let p1 = { x: ~~(positions[i][0] / 3), y: (positions[i][0] % 3) };
        let p2 = { x: ~~(positions[i][1] / 3), y: (positions[i][1] % 3) };
        let p3 = { x: ~~(positions[i][2] / 3), y: (positions[i][2] % 3) };
        let temp = board[p1.x][p1.y] === board[p2.x][p2.y];
        if (temp) temp = board[p1.x][p1.y] === board[p3.x][p3.y];
        if(temp && board[p1.x][p1.y] !== '') return board[p1.x][p1.y]
    }
    return -1;
}

//FOR NQUEENS 
// let board = [[""]]
// let fake = [[]]
// let v = null, repr, cleanup = [];
// let show;
// let highlight = [];

// const run = async ({ input, repr: r, show: s }) => {
//     repr = r;
//     repr.stop_execution();
//     repr.clear_queue();
//     show = s;
//     cleanup.forEach(e => e && e.release());
//     cleanup = [];
//     const [{value:size}] = await input(Node, 1);
//     board = [];
//     for (let i = 0; i < size; ++i){
//         let temp = [];
//         for (let j = 0; j < size; ++j) temp.push("");
//         board.push(temp);
//     }
//     fake = JSON.parse(JSON.stringify(board));
//     v = new VArray(repr, {
//         value: board,
//     });
//     v.value = board;
//     NQueen(board, 0, size);
//     cleanup.push(v);
//     show(() => v.release());
// }

// const NQueen = (prev, col, size) => {
//     for (let i = 0; i < size; ++i){
//         prev[i][col] = 1;
//         v.highlight(i, col);
//         highlight.push({row:i,col})
//         if (valid(prev, i, col, size)) {
//             if (col + 1 != size)
//                 NQueen(prev, col + 1, size);
//             else {
//                 let temp = new VArray(repr, { value: fake, show: false });
//                 for (let i in highlight) temp.highlight(highlight[i].row, highlight[i].col);
//                 cleanup.push(temp);
//                 show(() => {
//                     temp.show();
//                 });
//             }
//         }
//         prev[i][col] = "";
//         v.remove_highlight(i, col);
//         highlight.pop();
//     }
//     return false;
// }
// const valid = (current, row, col, size) => {
//     for (let i = row-1, j = col-1; i >= 0 && j >= 0; i--, j--)
//         if (current[i][j] == 1) return false;
    
//     for (let i = row+1, j = col-1; i < size && j >= 0; i++, j--)
//         if (current[i][j] == 1) return false;
//     for (let i = col-1; i >= 0; i--)
//         if (current[row][i] == 1) return false;
//     return true;
// }

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