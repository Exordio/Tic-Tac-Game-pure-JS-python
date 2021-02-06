const selectForm = document.querySelector(".select"),
    selectOnepc = selectForm.querySelector(".onepc"),
    selectWithbot = selectForm.querySelector(".withbot"),

    selectMultiplayer = selectForm.querySelector(".multiplayer"),

    multiplayerSettings = document.querySelector(".form-room_select"),

    connectBtn = document.querySelector(".connect"),

    board = document.querySelector(".board"),
    boxSpans = document.querySelectorAll("section span"),

    players = document.querySelector(".players"),
    resultForm = document.querySelector(".result-form"),
    winText = document.querySelector(".winnertext"),
    selectRestart = document.getElementById('restart'),
    mainMenu = document.getElementById('mainMenu');


cells = document.getElementsByClassName('cell');

player = "x";
bot_in_game = false;
in_multiplauer = false;
timeDelay = 300;


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



ws = new WebSocket("ws://localhost:8765")
ws.onmessage = ({
    data
}) => {
    turn = false
    game_log_x = []
    game_log_o = []
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
            board.setAttribute("class", "board");
            resultForm.setAttribute("class", "result-form show");
            players.setAttribute("class", "players");
            winText.innerHTML = `Игрок <p>x</p> выйграл в игре`;
            player = "x";
            ws.send(JSON.stringify({
                "clear": "+"
            }))
            return;
        } else if (checkWin(game_log_o)) {
            board.setAttribute("class", "board");
            resultForm.setAttribute("class", "result-form show");
            players.setAttribute("class", "players");
            winText.innerHTML = `Игрок <p>o</p> выйграл в игре`;
            player = "x";
            ws.send(JSON.stringify({
                "clear": "+"
            }))
            return;
        } else if (game_log_x.length + game_log_o.length >= 9) {
            board.setAttribute("class", "board");
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
        board.classList.add("show");
        bot_in_game = false;
    }

    selectWithbot.onclick = () => {
        selectForm.classList.add("hide");
        board.classList.add("show");
        bot_in_game = true;
    }

    selectMultiplayer.onclick = () => {
        selectForm.classList.add("hide");
        multiplayerSettings.classList.add("show");
        in_multiplauer = true;
    }

    connectBtn.onclick = () => {
        connect();
    }

    selectRestart.onclick = () => {
        resultForm.classList.remove("show");
        restart();
        board.classList.add("show");
    }

    mainMenu.onclick = () => {
        resultForm.classList.remove("show");
        restart();
        selectForm.classList.remove("hide");
        in_multiplauer = false;
        bot_in_game = false;
    }

}


function connect() {
    username = document.getElementById("input_nickname").value;
    roomName = document.getElementById("input_roomname").value;

    console.log(username + " " + roomName);

    ws.send(JSON.stringify({
        'username': username,
        'roomName': roomName
        //        'my_socket_id': my_socket
    }));

    multiplayerSettings.classList.remove("show");
    board.classList.add("show");
}

for (let i = 0; i < cells.length; i++) {
    cells[i].addEventListener('click', cellClick, false);
}

function cellClick() {
    var data = [];
    var data_bot = [];

    if (!this.innerHTML) {
        this.innerHTML = `<p>${player}</p>`;

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
            board.setAttribute("class", "board");
            resultForm.setAttribute("class", "result-form show");
            winText.innerHTML = `Игрок <p>${player.toUpperCase()}</p> выйграл в игре`;
            player = "x";
            return;

        } else {
            draw = true;
            for (i in cells) {
                if (cells[i].innerHTML == '') {
                    draw = false;
                }
            }
            if (draw) {
                board.setAttribute("class", "board");
                resultForm.setAttribute("class", "result-form show");
                winText.innerHTML = `Ничья!`;
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
            bot();
        }, timeDelay)
    }
}

function bot() {
    var arr = [];
    for (var i = 0; i < boxSpans.length; i++) {
        if (boxSpans[i].childElementCount == 0) {
            arr.push(i);
        }
    }
    let rand = arr[Math.floor(Math.random() * arr.length)];
    console.log(rand);

    if (arr.length > 0) {
        boxSpans[rand].innerHTML = `<p>${player}</p>`;
    }

    for (var i in cells) {
        if (cells[i].innerHTML == `<p>${player}</p>`) {
            data_bot.push(parseInt(cells[i].getAttribute('pos')));
            console.log(data_bot);
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
            board.setAttribute("class", "board");
            resultForm.setAttribute("class", "result-form show");
            winText.innerHTML = `Вы проиграли боту<br>ну и ладно.`;
            player = "x";
            return;
        }
    }, timeDelay + 100)
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
