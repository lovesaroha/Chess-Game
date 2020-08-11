"use-strict";

/*  Love Saroha
    lovesaroha1994@gmail.com (email address)
    https://www.lovesaroha.com (website)
    https://github.com/lovesaroha  (github)
*/

// Choose theme at random.
const colors = ["#D64163", "#fa625f", "#4874E2"];
const colorsDark = ["#c13b59", "#e15856", "#4168cb"];
const selColor = Math.floor(Math.random() * colors.length);
document.documentElement.style.setProperty('--primary', colors[selColor]);
document.documentElement.style.setProperty('--primary-dark', colorsDark[selColor]);

// Get canvas info from DOM.
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

let playerOne = { score: 0, won: 0 };
let playerTwo = { score: 0, won: 0 };
let currentMove = 1;
let possibleMoves = [];
let selectedPosition = [];


let board = [];
let rockWhite = new Image();
rockWhite.src = "assets/images/rock-white.png";
let rockBlack = new Image();
rockBlack.src = "assets/images/rock-black.png";
let kingWhite = new Image();
kingWhite.src = "assets/images/king-white.png";
let kingBlack = new Image();
kingBlack.src = "assets/images/king-black.png";
let queenWhite = new Image();
queenWhite.src = "assets/images/queen-white.png";
let queenBlack = new Image();
queenBlack.src = "assets/images/queen-black.png";
let pawnWhite = new Image();
pawnWhite.src = "assets/images/pawn-white.png";
let pawnBlack = new Image();
pawnBlack.src = "assets/images/pawn-black.png";
let bishopWhite = new Image();
bishopWhite.src = "assets/images/bishop-white.png";
let bishopBlack = new Image();
bishopBlack.src = "assets/images/bishop-black.png";
let knightBlack = new Image();
knightBlack.src = "assets/images/knight-black.png";
let knightWhite = new Image();
knightWhite.src = "assets/images/knight-white.png";

let whiteImages = {
    5: rockWhite,
    4: bishopWhite,
    9: queenWhite,
    28: kingWhite,
    1: pawnWhite,
    3: knightWhite
};

let blackImages = {
    5: rockBlack,
    4: bishopBlack,
    9: queenBlack,
    28: kingBlack,
    1: pawnBlack,
    3: knightBlack
}

// Reset board function reset board values.
function resetGame() {
    board = [[5, 3, 4, 9, 28, 4, 3, 5], [1, 1, 1, 1, 1, 1, 1, 1]];
    for (let row = 0; row < 4; row++) {
        let row = [];
        for (let col = 0; col < 8; col++) {
            row.push(0);
        }
        board.push(row);
    }
    board.push([-1, -1, -1, -1, -1, -1, -1, -1]);
    board.push([-5, -3, -4, -28, -9, -4, -3, -5]);
    playerOne.score = 0;
    playerTwo.score = 0;
    currentMove = 1;
    updatePlayerCard();
}

resetGame();

// Show board function shows board values.
function showBoard() {
    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (board[row][col] != 0) {
                if (board[row][col] < 0) {
                    ctx.drawImage(blackImages[(-1 * board[row][col])], (col * 100) + 15, (row * 100) + 15);
                } else {
                    ctx.drawImage(whiteImages[board[row][col]], (col * 100) + 15, (row * 100) + 15);
                }
            }
        }
    }
}

setTimeout(function () {
    showBoard();
}, 1000);

// Get input position.
function getPosition(x, y) {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (x > (col * 100) && x < (col * 100) + 100) {
                if (y > (row * 100) && y < (row * 100) + 100) {
                    return [row, col];
                }
            }
        }
    }
}

// This function return possible moves.
function getPossibleMoves(position) {
    let piece = board[position[0]][position[1]];
    let moves = [];
    if (position[0] == selectedPosition[0] && position[1] == selectedPosition[1]) {
        return moves;
    }
    let option = Math.abs(piece);
    switch (option) {
        case 1:
            // Pawn.
            let totalMoves = 1;
            if ((position[0] == 6 && piece < 0) || (position[0] == 1 && piece > 0)) {
                totalMoves = 2;
            }
            for (m = 1; m <= totalMoves; m++) {
                let change = (m * currentMove);
                if (board[position[0] + change][position[1]] == 0) {
                    moves.push([position[0] + change, position[1]]);
                } else {
                    totalMoves = 1;
                }
                if (m < 2) {
                    let leftLimit = position[1] - 1;
                    let rightLimit = position[1] + 1;
                    if (rightLimit < 8) {
                        if (checkMove(position[0] + change, rightLimit, piece) == true) {
                            if (board[position[0] + change][rightLimit] != 0 || (board[position[0] + change][position[1]] * piece) > 0) {
                                moves.push([position[0] + change, rightLimit]);
                            }
                        }
                    }
                    if (leftLimit > 0) {
                        if (checkMove(position[0] + change, leftLimit, piece) == true) {
                            if (board[position[0] + change][leftLimit] != 0 || (board[position[0] + change][position[1]] * piece) > 0) {
                                moves.push([position[0] + change, leftLimit]);
                            }
                        }
                    }
                }
            }
            return moves;
        case 5:
            // Rock piece.
            return checkStraight(position, piece, moves, 9);
        case 4:
            // Bishp.
            return checkDiagonally(position, piece, moves, 9);
        case 9:
            // Queen;
            moves = checkStraight(position, piece, moves, 9);
            return checkDiagonally(position, piece, moves, 9);
        case 28:
            // King.
            moves = checkStraight(position, piece, moves, 2);
            return checkDiagonally(position, piece, moves, 2);
        case 3:
            // Knight.    
            if (position[0] - 2 >= 0) {
                if (position[1] + 1 < 8) {
                    if (checkMove(position[0] - 2, position[1] + 1, piece) == true) {
                        moves.push([position[0] - 2, position[1] + 1]);
                    }
                }
                if (position[1] - 1 >= 0) {
                    if (checkMove(position[0] - 2, position[1] - 1, piece) == true) {
                        moves.push([position[0] - 2, position[1] - 1]);
                    }
                }
            }
            if (position[0] + 2 < 8) {
                if (position[1] + 1 < 8) {
                    if (checkMove(position[0] + 2, position[1] + 1, piece) == true) {
                        moves.push([position[0] + 2, position[1] + 1]);
                    }
                }
                if (position[1] - 1 >= 0) {
                    if (checkMove(position[0] + 2, position[1] - 1, piece) == true) {
                        moves.push([position[0] + 2, position[1] - 1]);
                    }
                }
            }
            if (position[1] - 2 >= 0) {
                if (position[0] + 1 < 8) {
                    if (checkMove(position[0] + 1, position[1] - 2, piece) == true) {
                        moves.push([position[0] + 1, position[1] - 2]);
                    }
                }
                if (position[0] - 1 >= 0) {
                    if (checkMove(position[0] - 1, position[1] - 2, piece) == true) {
                        moves.push([position[0] - 1, position[1] - 2]);
                    }
                }
            }
            if (position[1] + 2 < 8) {
                if (position[0] + 1 < 8) {
                    if (checkMove(position[0] + 1, position[1] + 2, piece) == true) {
                        moves.push([position[0] + 1, position[1] + 2]);
                    }
                }
                if (position[0] - 1 >= 0) {
                    if (checkMove(position[0] - 1, position[1] + 2, piece) == true) {
                        moves.push([position[0] - 1, position[1] + 2]);
                    }
                }
            }
    }
    return moves;
}

// This function check move.
function checkMove(row, column, piece) {
    if (((board[row][column] > 0 || board[row][column] == 0) && piece < 0) || ((board[row][column] < 0 || board[row][column] == 0) && piece > 0)) {
        return true;
    }
    return false;
}


// This function update player cards.
function updatePlayerCard() {
    if(currentMove > 0) {
        document.getElementById("playerOneCard_ID").style = "border-bottom: 5px solid var(--primary);";
        document.getElementById("playerTwoCard_ID").style = "border-bottom: 5px solid #fff;";
    } else {
        document.getElementById("playerTwoCard_ID").style = "border-bottom: 5px solid var(--primary);";
        document.getElementById("playerOneCard_ID").style = "border-bottom: 5px solid #fff;";
    }
}

// This function check horizontal moves.
function checkStraight(position, piece, moves, maximum) {
    let direction = [true, true, true, true];
    for (let i = 1; i < maximum; i++) {
        if (position[0] - i >= 0 && direction[0] == true) {
            if (checkMove(position[0] - i, position[1], piece) == true) {
                moves.push([position[0] - i, position[1]]);
                if (board[position[0] - i][position[1]] != 0) {
                    direction[0] = false;
                }
            } else {
                direction[0] = false;
            }
        }
        if (position[0] + i < 8 && direction[1] == true) {
            if (checkMove(position[0] + i, position[1], piece) == true) {
                moves.push([position[0] + i, position[1]]);
                if (board[position[0] + i][position[1]] != 0) {
                    direction[1] = false;
                }
            } else {
                direction[1] = false;
            }
        }
        if (position[1] - i >= 0 && direction[2] == true) {
            if (checkMove(position[0], position[1] - i, piece) == true) {
                moves.push([position[0], position[1] - i]);
                if (board[position[0]][position[1] - i] != 0) {
                    direction[2] = false;
                }
            } else {
                direction[2] = false;
            }
        }
        if (position[1] + i < 8 && direction[3] == true) {
            if (checkMove(position[0], position[1] + i, piece) == true) {
                moves.push([position[0], position[1] + i]);
                if (board[position[0]][position[1] + i] != 0) {
                    direction[3] = false;
                }
            } else {
                direction[3] = false;
            }
        }
    }
    return moves;
}

// This function check diagonally.
function checkDiagonally(position, piece, moves, maximum) {
    let direction = [true, true, true, true];
    for (let i = 1; i < maximum; i++) {
        if (position[0] - i >= 0 && position[1] - i >= 0 && direction[0] == true) {
            if (checkMove(position[0] - i, position[1] - i, piece) == true) {
                moves.push([position[0] - i, position[1] - i]);
                if (board[position[0] - i][position[1] - i] != 0) {
                    direction[0] = false;
                }
            } else {
                direction[0] = false;
            }
        }
        if (position[0] - i >= 0 && position[1] + i < 8 && direction[1] == true) {
            if (checkMove(position[0] - i, position[1] + i, piece) == true) {
                moves.push([position[0] - i, position[1] + i]);
                if (board[position[0] - i][position[1] + i] != 0) {
                    direction[1] = false;
                }
            } else {
                direction[1] = false;
            }
        }
        if (position[0] + i < 8 && position[1] - i >= 0 && direction[2] == true) {
            if (checkMove(position[0] + i, position[1] - i, piece) == true) {
                moves.push([position[0] + i, position[1] - i]);
                if (board[position[0] + i][position[1] - i] != 0) {
                    direction[2] = false;
                }
            } else {
                direction[2] = false;
            }
        }
        if (position[0] + i < 8 && position[1] + i < 8 && direction[3] == true) {
            if (checkMove(position[0] + i, position[1] + i, piece) == true) {
                moves.push([position[0] + i, position[1] + i]);
                if (board[position[0] + i][position[1] + i] != 0) {
                    direction[3] = false;
                }
            } else {
                direction[3] = false;
            }
        }
    }
    return moves;
}

// Select event.
canvas.addEventListener("mousedown", function (e) {
    let position = getPosition(e.offsetX, e.offsetY);
    let piece = board[position[0]][position[1]];
    if (currentMove * piece > 0) {
        // Select piece.
        possibleMoves = getPossibleMoves(position);
        showPossibleMoves();
        selectedPosition = position;
        return;
    }
    if (selectedPosition.length > 0) {
        if ((currentMove > 0 && board[selectedPosition[0]][selectedPosition[1]] > 0 && piece <= 0) || (currentMove < 0 && board[selectedPosition[0]][selectedPosition[1]] < 0 && piece >= 0)) {
            // Reset selected piece make a move.
            makeMove(position);
            showBoard();
            selectedPosition = [];
            possibleMoves = [];
        }
    }
});

// This function shows possible moves.
function showPossibleMoves() {
    if (possibleMoves.length == 0) {
        return;
    }
    showBoard();
    for (let i = 0; i < possibleMoves.length; i++) {
        ctx.beginPath();
        ctx.arc((possibleMoves[i][1] * 100) + 50, (possibleMoves[i][0] * 100) + 50, 10, 0, 2 * Math.PI);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#666";
        ctx.stroke();
    }
}

// Make move function makes a move.
function makeMove(position) {
    if (possibleMoves.length == 0 || selectedPosition.length == 0) {
        return;
    }
    let moveFound = false;
    // Check moves.
    for (let i = 0; i < possibleMoves.length; i++) {
        if (position[0] == possibleMoves[i][0] && position[1] == possibleMoves[i][1]) {
            moveFound = true;
        }
    }
    if (moveFound == false) {
        return;
    }
    if (board[position[0]][position[1]] == 28) {
        resetGame();
        showBoard();
        showModal({
            title: ``,
            content: `<center><i class="fal fa-trophy fa-5x mb-1 text-primary"></i> <h4 class="mb-0">Congratulations</h4>
            <h4 class="text-muted">Player two won this game</h4></center>`
        });
        playerTwo.won++;
        document.getElementById("playerTwoWon_ID").innerText = playerTwo.won;
        return;
    }
    if (board[position[0]][position[1]] == -28) {
        resetGame();
        showBoard();
        showModal({
            title: ``,
            content: `<center><i class="fal fa-trophy fa-5x mb-1 text-primary"></i> <h4 class="mb-0">Congratulations</h4>
            <h4 class="text-muted">Player One won this game</h4></center>`
        });
        playerOne.won++;
        document.getElementById("playerOneWon_ID").innerText = playerOne.won;
        return;
    }
    if (board[position[0]][position[1]] < 0) {
        playerOne.score += board[position[0]][position[1]];
    }
    if (board[position[0]][position[1]] > 0) {
        playerTwo.score += board[position[0]][position[1]];
    }
    if (playerTwo.score > 33 && playerOne.score > 33) {
        // Draw.
        resetGame();
        showBoard();
        return;
    }
    board[position[0]][position[1]] = board[selectedPosition[0]][selectedPosition[1]];
    board[selectedPosition[0]][selectedPosition[1]] = 0;
    currentMove *= -1;
    updatePlayerCard();
}

// This is a showModal function which shows bootstrap modal based on given options as an argument.  
function showModal(options) {
    if (options == undefined) {
        options = { size: ``, headColor: ``, id: `modal_ID`, bodyHeaderContent: ``, content: ``, title: `` };
    } else {
        options.id = options.id || `modal_ID`;
        options.headColor = options.headColor || ``;
        options.size = options.size || ``;
        options.content = options.content || ``;
        options.title = options.title || ``;
        options.bodyHeaderContent = options.bodyHeaderContent || ``;
    }
    let modal = document.getElementById(options.id);
    if (modal == null) { return; }
    [modal.style, modal.className] = ["display: block;", "modal show"];
    modal.innerHTML = `<div id="modalDialog_ID" class="modal-dialog modal-dialog-scrollable shadow ${options.size}" role="document">
    <div class="modal-content">
        <div class="modal-header ${options.headColor}" id="modalHeader_ID">
            <h4 class="modal-title mb-0" id="modalTitle_ID">${options.title}</h4>
            <button type="button" class="close" onclick="javascript: closeModal();">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body" id="modalBody_ID">
            <div class="modal-body-header-content" id="modalBodyHeaderContent_ID">${options.bodyHeaderContent}</div>
            <div id="modalMessage_ID"></div>
            <div class="modal-body-content pb-3" id="modalContent_ID">${options.content}</div>
        </div>
    </div>
    </div>`;
    if (document.getElementById('modalBackdrop_ID') == null) {
        let el = document.createElement("div");
        el.className = `modal-backdrop fade show`;
        el.id = `modalBackdrop_ID`;
        document.getElementById('body_ID').appendChild(el);
    }
}

// This is closeModal function which closes boostrap modal and remove backdrop from body.
function closeModal() {
    let modal = document.getElementById("modal_ID");
    modal.removeAttribute("style");
    modal.className = "modal";
    modal.innerHTML = `<div id="modalDialog_ID" class="modal-dialog modal-dialog-scrollable shadow" role="document">
    <div class="modal-content">
        <div class="modal-header" id="modalHeader_ID">
            <h4 class="modal-title" id="modalTitle_ID"></h4>
            <button type="button" class="close" onclick="javascript: closeModal();">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body" id="modalBody_ID">
            <div class="modal-body-header-content" id="modalBodyHeaderContent_ID"></div>
            <div id="modalMessage_ID"></div>
            <div class="modal-body-content" id="modalContent_ID"></div>
        </div>
    </div>
    </div>`;
    if (document.getElementById("modalBackdrop_ID") != null) {
        document.getElementById("modalBackdrop_ID").remove();
    }
}