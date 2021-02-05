const selectForm = document.querySelector(".select"),
    selectOnepc = selectForm.querySelector(".onepc"),
    selectWithbot = selectForm.querySelector(".withbot"),
    board = document.querySelector(".board"),
    allBox = document.querySelectorAll("section span"),


    players = document.querySelector(".players"),

    resultForm = document.querySelector(".result-form"),
    winText = document.querySelector(".winnertext"),
    selectRestart = document.getElementById('restart'),
    mainMenu = document.getElementById('mainMenu');



cells = document.getElementsByClassName('cell');

player = "x";
bot_in_game = false

winIndex = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7]
];

window.onload = () => {
    selectOnepc.onclick = () => {
        selectForm.classList.add("hide");
        board.classList.add("show");
    }

    selectWithbot.onclick = () => {
        selectForm.classList.add("hide");
        board.classList.add("show");
        bot_in_game = true;
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
    }

}

for (i = 0; i < cells.length; i++) {
    cells[i].addEventListener('click', cellClick, false);
}


function cellClick() {
    data = [];

    if (!this.innerHTML) {
        this.innerHTML = `<strong>${player}<\strong>`;
    } else {
        alert("Занято");
        return;
    }

    for (i in cells) {
        if (cells[i].innerHTML == player) {
            data.push(parseInt(cells[i].getAttribute('pos')));
        }
    }

//    console.log(data);

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

    if (player == "o") {
        players.setAttribute("class", "players active");
    } else {
        players.setAttribute("class", "players");
    }

    if (bot_in_game) {
        bot()
    }

}

function bot() {
    let arr = [];
    for (let i = 0; i < allBox.length; i++) {
        if(allBox[i].childElementCount == 0){
            arr.push(i);
            console.log(i + " " + "has no child")
        }
    }
    
    console.log(arr)
}


function checkWin(data) {
    for (i in winIndex) {
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
    for (i = 0; i < cells.length; i++) {
        cells[i].innerHTML = '';
    }
}

function sleep(ms) {
    ms += new Date().getTime();
    while (new Date() < ms) {}
}
