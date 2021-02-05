const selectForm = document.querySelector(".select"),
    selectOnepc = selectForm.querySelector(".onepc"),
    selectWithbot = selectForm.querySelector(".withbot"),
    playWithfriend = document.querySelector(".playwithfriend"),
    players = document.querySelector(".players"),

    resultForm = document.querySelector(".result-form"),
    winText = document.querySelector(".winnertext"),
    selectRestart = document.getElementById('restart'),
    mainMenu = document.getElementById('mainMenu');

cells = document.getElementsByClassName('cell');

player = "x";

delayMSec = 1000;

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
        playWithfriend.classList.add("show");
    }

    selectRestart.onclick = () => {
        resultForm.classList.remove("show");
        restart();
        playWithfriend.classList.add("show");
    }

    mainMenu.onclick = () => {
        resultForm.setAttribute("class", "result-form");
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
        this.innerHTML = player;
    } else {
        alert("Занято");
        return;
    }
    
    for (i in cells) {
        if (cells[i].innerHTML == player) {
            data.push(parseInt(cells[i].getAttribute('pos')));
        }
    }

    
    
    console.log(data);

    if (checkWin(data)) {
        playWithfriend.setAttribute("class", "playwithfriend");
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
            playWithfriend.setAttribute("class", "playwithfriend");
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
