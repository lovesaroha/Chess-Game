"use-strict";

/*  Love Saroha
    lovesaroha1994@gmail.com (email address)
    https://www.lovesaroha.com (website)
    https://github.com/lovesaroha  (github)
*/

// Themes.
const themes = [
    {
        normal: "#5468e7",
        dark: "#4c5ed0",
        light: "#98a4f1",
        veryLight: "#eef0fd"
    }, {
        normal: "#e94c2b",
        dark: "#d24427",
        veryLight: "#fdedea",
        light: "#f29480"
    }
];

// Choose random color theme.
let colorTheme = themes[Math.floor(Math.random() * themes.length)];

// This function set random color theme.
function setTheme() {
    // Change css values.
    document.documentElement.style.setProperty("--primary", colorTheme.normal);
}

// Set random theme.
setTheme();


// Get canvas info from DOM.
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

let playerOne = { score: 0, won: 0 };
let playerTwo = { score: 0, won: 0 };
let currentMove = 1;
let possibleMoves = [];
let selectedPosition = [];


let board = [];

let icons = {
    5: "\uf447",
    4: "\uf43a",
    9: "\uf445",
    28: "\uf43f",
    1: "\uf443",
    3: "\uf441"
};

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
    for (let i = 0; i < possibleMoves.length; i++) {
        ctx.beginPath();
        ctx.arc((possibleMoves[i][1] * 80) + 40, (possibleMoves[i][0] * 80) + 40, 5, 0, 2 * Math.PI);
        ctx.lineWidth = 10;
        ctx.strokeStyle = colorTheme.normal;
        ctx.stroke();
    }
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (board[row][col] != 0) {
                if (board[row][col] < 0) {
                    ctx.font = '300 70px "Font Awesome 5 Pro"';
                    ctx.fillStyle = colorTheme.dark;
                    ctx.textAlign = 'center';
                    ctx.fillText(icons[board[row][col] * -1], (col * 80) + 40, (row * 80) + 65);
                } else {
                    ctx.font = '300 70px "Font Awesome 5 Pro"';
                    ctx.fillStyle = colorTheme.light;
                    ctx.textAlign = 'center';
                    ctx.fillText(icons[board[row][col]], (col * 80) + 40, (row * 80) + 65);
                }
            }
        }
    }
    // Show rectangles.
    let show = -1;
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (show == 1) {
                // Show rectangle.
                ctx.beginPath();
                ctx.fillStyle = colorTheme.veryLight;
                ctx.fillRect((col * 80), (row * 80), 80, 80);
                ctx.stroke();
            }
            show *= -1;
        }
        show *= -1;
    }
}


showBoard();

// Get input position.
function getPosition(x, y) {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (x > (col * 80) && x < (col * 80) + 100) {
                if (y > (row * 80) && y < (row * 80) + 100) {
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
                    if (leftLimit >= 0) {
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
    if (currentMove > 0) {
        // White turn.
        document.getElementById("playerOneCard_id").classList.add("border-primary");
        document.getElementById("playerTwoCard_id").classList.remove("border-primary");
    } else {
        // Black turn.
        document.getElementById("playerOneCard_id").classList.remove("border-primary");
        document.getElementById("playerTwoCard_id").classList.add("border-primary");
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
        selectedPosition = position;
        return;
    }
    if (selectedPosition.length > 0) {
        if ((currentMove > 0 && board[selectedPosition[0]][selectedPosition[1]] > 0 && piece <= 0) || (currentMove < 0 && board[selectedPosition[0]][selectedPosition[1]] < 0 && piece >= 0)) {
            // Reset selected piece make a move.
            makeMove(position);
            selectedPosition = [];
            possibleMoves = [];
        }
    }
});

// Make move function makes a move.
function makeMove(position) {
    if (possibleMoves.length == 0 || selectedPosition.length == 0) { return; }
    let moveFound = false;
    // Check moves.
    for (let i = 0; i < possibleMoves.length; i++) {
        if (position[0] == possibleMoves[i][0] && position[1] == possibleMoves[i][1]) {
            moveFound = true;
        }
    }
    if (!moveFound) { return; }
    if (board[position[0]][position[1]] == 28) {
        resetGame();
        showModal(`<div class="bg-modal fade-in modal-content mx-auto mt-10 overflow-hidden p-4 shadow-xl sm:max-w-lg sm:w-full"><center><i class="fad fa-trophy fa-5x mb-1 text-primary"></i> <h1 class="mb-0 font-bold">Game Over</h1>
            <h4 class="text-subtitle">Black won this game</h4></center></div>`);
        playerTwo.won++;
        document.getElementById("playerTwoWon_id").innerText = playerTwo.won;
        return;
    }
    if (board[position[0]][position[1]] == -28) {
        resetGame();
        showModal(`<div class="bg-modal fade-in modal-content mx-auto mt-10 overflow-hidden p-4 shadow-xl sm:max-w-lg sm:w-full"><center><i class="fad fa-trophy fa-5x mb-1 text-primary"></i> <h1 class="mb-0 font-bold">Game Over</h1>
            <h4 class="text-subtitle">White won this game</h4></center></div>`);
        playerOne.won++;
        document.getElementById("playerOneWon_id").innerText = playerOne.won;
        return;
    }
    if (board[position[0]][position[1]] < 0) {
        playerOne.score += board[position[0]][position[1]] * -1;
    }
    if (board[position[0]][position[1]] > 0) {
        playerTwo.score += board[position[0]][position[1]];
    }
    // Check pawn.
    if (Math.abs(board[selectedPosition[0]][selectedPosition[1]]) == 1 && (position[0] == 0 || position[0] == 7)) {
        // Add queen.
        board[position[0]][position[1]] = 9 * currentMove;
    } else {
        board[position[0]][position[1]] = board[selectedPosition[0]][selectedPosition[1]];
    }
    board[selectedPosition[0]][selectedPosition[1]] = 0;
    currentMove *= -1;
    updatePlayerCard();
}

// Draw.
function draw() {
    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    showBoard();
    window.requestAnimationFrame(draw);
}

draw();

// All functions related to modal.
// This is a showModal function which shows modal based on given options as an argument.  
function showModal(content) {
    let modal = document.getElementById("modal_id");
    if (modal == null) { return; }
    modal.style = "display: block;";
    modal.innerHTML = content;
}

// This is closeModal function which closes modal and remove backdrop from body.
function closeModal() {
    let modal = document.getElementById("modal_id");
    if (modal == null) { return; }
    modal.style = "display: none;";
    modal.innerHTML = ``;
}

// This is closeModal background function which closes modal.
function closeModalBackground(e) {
    if (e.target.id != "modal_id") { return; }
    let modal = document.getElementById("modal_id");
    if (modal == null) { return; }
    modal.style = "display: none;";
    modal.innerHTML = ``;
}
