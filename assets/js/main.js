/*var area = document.getElementById('area');
var square = document.getElementsByClassName('square');
/*
for (var i = 1; i <= 9; i++){
    if (i == 1) {
        area.innerHTML += "<section>";
        area.innerHTML += "<span class='square' pos=" + i + "></div>";
    }
    area.innerHTML += "<span class='square' pos=" + i + "></div>";
    
}*/

const selectForm = document.querySelector(".select"),

    selectOnepc = selectForm.querySelector(".onepc"),
    selectWithbot = selectForm.querySelector(".withbot"),
playWithfriend = document.querySelector(".playwithfriend"),
players = document.querySelector(".players");

cells = document.getElementsByClassName('cell');

player = "x";
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
}

for (i = 0; i < cells.length; i++) {
    cells[i].addEventListener('click', cellClick, false)
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
        alert("Выйграл : " + player);
    }
    player = player == "x" ? "o" : "x";

    if (player == "o") {
        players.setAttribute("class", "players active");
    }
    else {
        players.setAttribute("class", "players")
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
