$ (() => {
    var board;
const playerOne = 'O';
const playerTwo = 'X';
const wins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
const cells = [$ ('.cell')];

startGame = () => {
    $ ('.endgame').css('display', 'none');
    board = Array.from(Array(9).keys());
    cells.forEach((cell) => {
        cell.text('');
    cell.css('background-color', '');
    cell.click(turnClick);
});
}

turnClick = square => {
    if (typeof board[square.target.id] == 'number') {
        turn(square.target.id, playerOne);
        if (!checkTie()) turn(bestSpot(), playerTwo);
    }//check tie game error
}

turn = (square, player) => {
    board[square] = player;
    $ ('#' + square).text(player);
    var done = checkWin(board, player);
    console.log(done);
    if (done) finishGame(done);
}

checkWin = (updatedBoard, player) => {
    var plays = updatedBoard.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
    var done = null;

    for (let [i, win] of wins.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            done = {index: i, player: player};
            break;
        }
    }

    return done;
}

finishGame = (done) => {
    for (let i of wins[done.index]) {
        $ ('#' + i).css('background-color', (done.player == playerOne ? 'blue' : 'red'));
    }
    $ ('.cell').off();
    declareWinner(done.player == playerOne ? "Player One Won!" : "Player Two Won!");
}

declareWinner = (winner) => {
    $ ('.text').text(winner);
    $ ('.endgame').css('display', 'block');
}

emptySquares = () => {
    return board.filter(s => typeof s == 'number');
}

bestSpot = () => {
    return minimax(board, playerTwo).index;
}

checkTie = () => {
    if (emptySquares().length == 0) {
        $ ('.cell').off().css('background-color', 'green');
        declareWinner("Tie Game!");
        return true;
    }
    return false;
}

minimax = (newBoard, player) => {
    var spots = emptySquares(newBoard);

    if (checkWin(newBoard, player)) {
        return {score: -10};
    } else if (checkWin(newBoard, playerTwo)) {
        return {score: 10};
    } else if (spots.length === 0) {
        return {score: 0};
    }
    var moves = [];

    for (var i = 0; i < spots.length; i++) {
        var move = {};
        move.index = newBoard[spots[i]];
        newBoard[spots[i]] = player;

        if (player == playerTwo) {
            var result = minimax(newBoard, playerOne);
            move.score = result.score;
        } else {
            var result = minimax(newBoard, playerTwo);
            move.score = result.score;
        }

        newBoard[spots[i]] = move.index;

        moves.push(move);
    }

    var bestMove;
    if (player === playerTwo) {
        var bestScore = -10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        var bestScore = 10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

startGame();
});
