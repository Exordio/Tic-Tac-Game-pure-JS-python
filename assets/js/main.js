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
selectWithbot = selectForm.querySelector(".withbot");
playWithfriend = document.querySelector(".playwithfriend")

window.onload = ()=>{
    selectOnepc.onclick = ()=>{
        selectForm.classList.add("hide");
        playWithfriend.classList.add("show");
    }
}
