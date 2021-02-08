const selectForm = document.querySelector(".select"),

    selectOnepc = selectForm.querySelector(".onepc"),
    selectWithbot = selectForm.querySelector(".withbot"),

    past_games = document.querySelector(".past_games"),
    past_games_content = past_games.querySelector(".content"),

    diffForm = document.querySelector(".form-diff-bot"),

    low_diff = document.querySelector(".low"),
    high_diff = document.querySelector(".high"),

    selectMultiplayer = selectForm.querySelector(".multiplayer"),

    multiplayerSettings = document.querySelector(".form-room_select"),

    connectBtn = document.querySelector(".connect"),

    board_field = document.querySelector(".board"),
    boxSpans = document.querySelectorAll("section span"),

    players = document.querySelector(".players"),
    resultForm = document.querySelector(".result-form"),
    winText = document.querySelector(".winnertext"),
    selectRestart = document.getElementById('restart'),
    mainMenu = document.getElementById('mainMenu'),
    playerName = document.getElementById('input_nickname_mainmenu');




cells = document.getElementsByClassName('cell');

player = "x";
bot_in_game = false;
in_multiplauer = false;
timeDelay = 300;
log = [];
multiplayer_log = [];


const winIndex = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7]
];



function isDict(v) {
    return !!v && typeof v === 'object' && v !== null && !(v instanceof Array) && !(v instanceof Date) && isJsonable(v);
}


ws = new WebSocket("ws://localhost:8765")
ws.onmessage = ({
    data
}) => {
    turn = false;
    //TODO LOG MULTIPLAYER
    game_log_x = [];
    game_log_o = [];
    // Обработка логов с вебсокет сервера, загрузка истории
    try {
        if (JSON.parse(data)[0].slice(JSON.parse(data)[0].length - 1, JSON.parse(data)[0].length) == "log") {
            var past_games_parse = JSON.parse(data).reverse();
            // Вывод последних 5 игр.
            for (let i = 0; i < 5; i++) {
                try {
                    let x = past_games_parse[i].slice(past_games_parse[i].length - 5, past_games_parse[i].length)

                    console.log(x);
                    if (x[1]["type_of_game"] == "1 X 1") {
                        type_of_game = x[1]['type_of_game'];
                        winner_f_log = x[2]['winner'];
                        time_f_log = x[3]['time'].slice(15, 21);

                        if (winner_f_log != "Draw") {
                            past_games_content.innerHTML += `<div class="win_block">${time_f_log} ${type_of_game} Победил : <p>${winner_f_log.toUpperCase()}</p><div>`
                        } else {
                            past_games_content.innerHTML += `<div class="win_block"> ${time_f_log} ${type_of_game} Ничья <div>`
                        }
                    } else if (x[1]["type_of_game"] == "With bot") {
                        player_name = x[0]['player_name'];
                        type_of_game = x[1]['type_of_game'];
                        winner_f_log = x[2]['winner'];
                        time_f_log = x[3]['time'].slice(15, 21);

                        if (winner_f_log != "Draw") {
                            past_games_content.innerHTML += `<div class="win_block"> ${time_f_log} ${player_name} VS Bot <p>Победил : ${winner_f_log}</p><div>`
                        } else {
                            past_games_content.innerHTML += `<div class="win_block"> ${time_f_log} ${player_name} VS Bot Ничья <div>`
                        }
                    }

                } catch {
                }
            }

        }
    } catch {
        //console.log("Type error - history was empty?")
    }

    if (in_multiplauer == true) {
        console.log(parseInt(data))
        boxSpans[parseInt(data) - 1].innerHTML = `<p>${player}</p>`;
        player = player == "x" ? "o" : "x";
        if (player == "o") {
            players.setAttribute("class", "players active");
        } else {
            players.setAttribute("class", "players");
        }

        for (var i in cells) {
            if (cells[i].innerHTML == `<p>x</p>`) {
                game_log_x.push(parseInt(cells[i].getAttribute('pos')));
            }
            if (cells[i].innerHTML == `<p>o</p>`) {
                game_log_o.push(parseInt(cells[i].getAttribute('pos')))
            }
        }

        console.log(game_log_x)
        console.log(game_log_o)
        
        

        if (checkWin(game_log_x)) {
            board_field.setAttribute("class", "board");
            resultForm.setAttribute("class", "result-form show");
            players.setAttribute("class", "players");
            winText.innerHTML = `Игрок <p>x</p> выйграл в игре`;
            
            ws.send(JSON.stringify({
                "clear": "+"
            }))
            return;
        } else if (checkWin(game_log_o)) {
            board_field.setAttribute("class", "board");
            resultForm.setAttribute("class", "result-form show");
            players.setAttribute("class", "players");
            winText.innerHTML = `Игрок <p>o</p> выйграл в игре`;
            player = "x";
            
            ws.send(JSON.stringify({
                "clear": "+"
            }))
            return;
        } else if (game_log_x.length + game_log_o.length >= 9) {
            board_field.setAttribute("class", "board");
            resultForm.setAttribute("class", "result-form show");
            players.setAttribute("class", "players");
            winText.innerHTML = `Ничья ! `;
            player = "x";
            
            ws.send(JSON.stringify({
                "clear": "+"
            }))
            return;
        }
    }
}

window.onload = () => {
    selectOnepc.onclick = () => {
        selectForm.classList.add("hide");
        past_games.classList.add("hide");
        board_field.classList.add("show");
        bot_in_game = false;
    }

    selectWithbot.onclick = () => { //выбор игры с ботом
        selectForm.classList.add("hide");
        past_games.classList.add("hide");
        diffForm.classList.add("show");

    }

    low_diff.onclick = () => {
        diffForm.classList.remove("show");
        board_field.classList.add("show");
        bot_in_game = true;
        minimax_check = false;
    }

    high_diff.onclick = () => {
        diffForm.classList.remove("show");
        board_field.classList.add("show");
        bot_in_game = true;
        minimax_check = true;
    }


    selectMultiplayer.onclick = () => {
        selectForm.classList.add("hide");
        past_games.classList.add("hide");
        multiplayerSettings.classList.add("show");
        in_multiplauer = true;
    }

    connectBtn.onclick = () => {
        connect();
    }

    selectRestart.onclick = () => {
        resultForm.classList.remove("show");
        restart();
        board_field.classList.add("show");
        log = [];
        swith_log = false;
    }

    mainMenu.onclick = () => {
        resultForm.classList.remove("show");
        past_games.classList.remove("hide");
        restart();
        selectForm.classList.remove("hide");
        location.reload();

    }

}


function connect() {
    username = document.getElementById("input_nickname").value;
    roomName = document.getElementById("input_roomname").value;

    console.log(username + " " + roomName);

    ws.send(JSON.stringify({
        username: username,
        roomName: roomName
        //        'my_socket_id': my_socket
    }));

    multiplayerSettings.classList.remove("show");
    board_field.classList.add("show");
}

for (let i = 0; i < cells.length; i++) {
    cells[i].addEventListener('click', cellClick, false);
}

swith_log = false;

function cellClick() {
    var data = [];

    if (!this.innerHTML) {
        this.innerHTML = `<p>${player}</p>`;
        if (in_multiplauer == false) {
            logging(parseInt(this.getAttribute('pos')))
        }

        if (in_multiplauer) {
            ws.send(JSON.stringify({
                'room_turn': roomName,
                'turn': parseInt(this.getAttribute('pos'))
                //            'my_socket_id': my_socket
            }));
        }

    } else {
        alert("Занято");
        return;
    }


    for (var i in cells) {
        if (cells[i].innerHTML == `<p>${player}</p>`) {
            data.push(parseInt(cells[i].getAttribute('pos')));
        }
    }

    if (in_multiplauer == false) {
        if (checkWin(data)) {
            if (bot_in_game) {
                board_field.setAttribute("class", "board");
                resultForm.setAttribute("class", "result-form show");
                winText.innerHTML = `Игрок <p>${player.toUpperCase()}</p> выйграл в игре`;

                log.push({
                    player_name: playerName.value
                }, {
                    type_of_game: "With bot"
                }, {
                    winner: playerName.value
                }, {
                    time: Date(Date.now()).toString()
                }, "log");
                console.log(log);
                pushlog(log); // Отправка лога на websocket server
                player = "x";
                return;
            } else {

                board_field.setAttribute("class", "board");
                resultForm.setAttribute("class", "result-form show");
                winText.innerHTML = `Игрок <p>${player.toUpperCase()}</p> выйграл в игре`;

                log.push({
                    type_of_game: "1 X 1"
                }, {
                    winner: player
                }, {
                    time: Date(Date.now()).toString()
                }, "log");
                console.log(log);
                pushlog(log); // Отправка лога на websocket server
                player = "x";
                return;
            }

        } else {
            draw = true;
            for (i in cells) {
                if (cells[i].innerHTML == '') {
                    draw = false;
                }
            }
            if (draw && !bot_in_game) {
                board_field.setAttribute("class", "board");
                resultForm.setAttribute("class", "result-form show");
                winText.innerHTML = `Ничья!`;
                log.push({
                        type_of_game: "1 X 1"
                    }, {
                        winner: "Draw"
                    }, {
                        time: Date(Date.now()).toString()
                    },
                    "log");
                console.log(log);
                pushlog(log);
                player = "x";
                return;
            } else if (draw && bot_in_game) {
                board_field.setAttribute("class", "board");
                resultForm.setAttribute("class", "result-form show");
                winText.innerHTML = `Ничья!`;
                log.push({
                        player_name: playerName.value
                    }, {
                        type_of_game: "With bot"
                    }, {
                        winner: "Draw"
                    }, {
                        time: Date(Date.now()).toString()
                    },
                    "log");
                console.log(log);
                pushlog(log);
                player = "x";
                return;
            }
        }

        player = player == "x" ? "o" : "x";
    }

    if (player == "o") {
        players.setAttribute("class", "players active");
    } else {
        players.setAttribute("class", "players");
    }

    if (bot_in_game) {
        setTimeout(() => {
            bot(minimax_check); //Включение бота, и минимакса если выбрана высокая сложность
        }, timeDelay)
    }

}

function logging(turn_index) {
    if (!(swith_log)) {
        log.push({
            player_x: parseInt(turn_index)
        });
        //        console.log(log);
        swith_log = true;
    } else {
        log.push({
            player_o: parseInt(turn_index)
        });
        //        console.log(log);
        swith_log = false;
    }
}

function bot_logging(turn_index) {
    if ((in_multiplauer == false) && (bot_in_game == true)) {
        if (swith_log) {
            log.push({
                player_o: parseInt(turn_index + 1)
            });
            //            console.log(log);
            swith_log = false;
        }
    }
}


function bot(hard_bot) {
    var arr = [];
    var data_bot = [];

    if (hard_bot) {

        var originalBoard = get_the_board()
        var choise = minimax(originalBoard, "o")
        //        console.log(choise)

        boxSpans[choise['index']].innerHTML = `<p>${player}</p>`;

        for (var i in cells) {
            if (cells[i].innerHTML == `<p>${player}</p>`) {
                data_bot.push(parseInt(cells[i].getAttribute('pos')));
                //                console.log(data_bot);
            }
        }

        bot_logging(choise['index']);


        player = "x";
        if (player == "o") {
            players.setAttribute("class", "players active");
        } else {
            players.setAttribute("class", "players");
        }

        setTimeout(() => {
            if (checkWin(data_bot)) {
                board_field.setAttribute("class", "board");
                resultForm.setAttribute("class", "result-form show");
                winText.innerHTML = `Вы проиграли боту<br>ну и ладно.`;
                log.push({
                    player_name: playerName.value
                }, {
                    type_of_game: "With bot"
                }, {
                    winner: "bot"
                }, {
                    time: Date(Date.now()).toString()
                }, "log");
                console.log(log);
                pushlog(log);
                player = "x";
                return;
            }
        }, timeDelay + 100)

    } else {

        for (var i = 0; i < boxSpans.length; i++) {
            if (boxSpans[i].childElementCount == 0) {
                arr.push(i);
            }
        }
        let rand = arr[Math.floor(Math.random() * arr.length)];

        bot_logging(rand);

        if (arr.length > 0) {
            boxSpans[rand].innerHTML = `<p>${player}</p>`;
        }

        for (var i in cells) {
            if (cells[i].innerHTML == `<p>${player}</p>`) {
                data_bot.push(parseInt(cells[i].getAttribute('pos')));
            }
        }

        player = "x";
        if (player == "o") {
            players.setAttribute("class", "players active");
        } else {
            players.setAttribute("class", "players");
        }

        setTimeout(() => {
            if (checkWin(data_bot)) {
                board_field.setAttribute("class", "board");
                resultForm.setAttribute("class", "result-form show");
                winText.innerHTML = `Вы проиграли боту<br>ну и ладно.`;
                console.log(log);
                log.push({
                    player_name: playerName.value
                }, {
                    type_of_game: "With bot"
                }, {
                    winner: "bot"
                }, {
                    time: Date(Date.now()).toString()
                }, "log");
                console.log(log);
                pushlog(log);
                player = "x";
                return;
            }
        }, timeDelay + 100)

    }
}

function get_the_board() {
    var board = [];
    for (var i = 0; i < boxSpans.length; i++) {
        if (boxSpans[i].textContent == '') {
            board.push(i)
        } else {
            board.push(boxSpans[i].textContent);
        }
    }

    //    console.log(board);
    return board;
}

function emptyIndex(board) {
    return board.filter(s => s != "o" && s != "x");
}


function winning_for_minimax(board, player_minx) {
    if (
        (board[0] == player_minx && board[1] == player_minx && board[2] == player_minx) ||
        (board[3] == player_minx && board[4] == player_minx && board[5] == player_minx) ||
        (board[6] == player_minx && board[7] == player_minx && board[8] == player_minx) ||
        (board[0] == player_minx && board[3] == player_minx && board[6] == player_minx) ||
        (board[1] == player_minx && board[4] == player_minx && board[7] == player_minx) ||
        (board[2] == player_minx && board[5] == player_minx && board[8] == player_minx) ||
        (board[0] == player_minx && board[4] == player_minx && board[8] == player_minx) ||
        (board[2] == player_minx && board[4] == player_minx && board[6] == player_minx)
    ) {
        return true;
    } else {
        return false;
    }
}


// Рекурсивная реализация стратегии
function minimax(newBoard, player_minx) {
    var huPlayer = "x";
    var aiPlayer = "o";

    var availSpots = emptyIndex(newBoard);

    if (winning_for_minimax(newBoard, huPlayer)) {
        return {
            score: -10
        };
    } else if (winning_for_minimax(newBoard, aiPlayer)) {
        return {
            score: 10
        };
    } else if (availSpots.length === 0) {
        return {
            score: 0
        };
    }

    var moves = [];

    for (var i = 0; i < availSpots.length; i++) {

        var move = {};
        move.index = newBoard[availSpots[i]];

        newBoard[availSpots[i]] = player_minx;
        if (player_minx == aiPlayer) {
            var result = minimax(newBoard, huPlayer);
            move.score = result.score;
        } else {
            var result = minimax(newBoard, aiPlayer);
            move.score = result.score;
        }
        newBoard[availSpots[i]] = move.index;

        moves.push(move);
    }

    var bestMove;
    if (player_minx === aiPlayer) {
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


function checkWin(data) {
    for (var i in winIndex) {
        win = true;
        for (j in winIndex[i]) {
            id = winIndex[i][j];
            ind = data.indexOf(id);
            if (ind == -1) {
                win = false;
            }
        }
        if (win) {
            return true;
        }
    }
    return false;
}

function restart() {
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerHTML = '';
        players.setAttribute("class", "players");
    }
}


function pushlog(log) {
    ws.send(JSON.stringify(log))
}
