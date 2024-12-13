let num = Math.floor(Math.random() * 100) + 1;
let attempt = 0;
let coins = 0;
let low = 1;
let high = 100;

let attemptData = document.getElementById("Attempt");
let userinp = document.getElementById("inp");
let subBtn = document.getElementById("submit");
let resBtn = document.getElementById("resBtn");
let message = document.getElementById("msg");
let timerDisplay = document.getElementById("timer"); 
let coinsDisplay = document.getElementById("coins");
let timer; 
let timeLeft = 30;

let start = document.getElementById("starttimer");

function check() {
    let usernum = parseInt(userinp.value);

    if (usernum < low || usernum > high) {
        message.innerHTML = ` 🤷‍♂️ Please enter a valid number between ${low} and ${high}.`;
        message.style.color = "orange";
        return;
    }

    attempt++;
    attemptData.innerHTML = attempt;

    if (num === usernum) {
        message.innerHTML = `🎉 Congratulations! You guessed the correct number (${num}) after ${attempt} attempts!`;
        message.style.color = "green";
        subBtn.disabled = true; 
        resBtn.style.display = "block"; 
        coins += 10;
        coinsDisplay.innerHTML = `Coins: ${coins}`;
        clearInterval(timer);
    } else if (usernum < num) {
        low = usernum + 1;
        message.innerHTML = ` 😢Too low! Try again. Narrowed range: ${low} to ${high}`;
        message.style.color = "red";
    } else {
        high = usernum - 1;
        message.innerHTML = ` 😢Too high! Try again. Narrowed range: ${low} to ${high}`;
        message.style.color = "red";
    }


    userinp.value = "";

    if (num !== usernum) {
        setTimeout(() => {
            message.innerHTML = "";
        }, 3500);
    }
}

function restart() {
    num = Math.floor(Math.random() * 1000) + 1;
    attempt = 0;
    low = 1; 
    high = 1000; 
    attemptData.innerHTML = attempt;
    message.innerHTML = "";
    userinp.value = "";
    subBtn.disabled = false; 
    resBtn.style.display = "none"; 
    clearInterval(timer); 
    start.style.display = "block";
    timerDisplay.style.display = "none"; 
    coinsDisplay.innerHTML = `Coins: ${coins}`;
}

function endGame(finalMessage) {
    subBtn.disabled = true; 
    resBtn.style.display = "block"; 
    message.innerHTML = finalMessage;
    message.style.color = "red";
}

// function startTimer() {
//     subBtn.style.display="block";
//     subBtn.style.textAlign="center";
//     start.style.display = "none";
//     timerDisplay.style.display = "block";
//     timeLeft = 30;
//     timerDisplay.innerHTML = `Time Left: ${timeLeft}s`; 
//     timer = setInterval(() => {
//         timeLeft--;
//         timerDisplay.innerHTML = `Time Left: ${timeLeft}s`;

//         if (timeLeft <= 0) {
//             clearInterval(timer);
//             endGame("Time's up! You lost. The correct number was " + num);
//         }
//     }, 1000);
// }

subBtn.addEventListener("click", check);
resBtn.addEventListener("click", restart);
start.addEventListener("click", startTimer);
