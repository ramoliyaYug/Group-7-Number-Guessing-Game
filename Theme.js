let mode = document.getElementById('mode');
let cmode = "light";

function changeMode(){
    if(cmode === "light"){
        document.getElementById('body').style.backgroundColor = 'black';
        document.getElementById('body').style.color = 'white'; 
        cmode = "dark";
    } else if (cmode === "dark"){
        document.getElementById('body').style.backgroundColor = 'white';
        document.getElementById('body').style.color = 'black'; 
        cmode = "light";
    }
}

mode.addEventListener('click', changeMode);