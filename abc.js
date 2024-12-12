
// DOM elements

const guessInput = document.getElementById('guess-input');
const submitBtn = document.getElementById('submit-btn');
const attemptsDisplay = document.getElementById('attempts');
const currentScoreDisplay = document.getElementById('current-score');
const highScoreDisplay = document.getElementById('high-score');
const resetBtn = document.getElementById('reset-btn');
const resetHighScoreBtn = document.getElementById('reset-high-score-btn');
const feedback = document.getElementById('feedback');
const victoryMsg = document.getElementById('victory-message');



// Game variables

const min = 1;
const max = 100;
let randomNumber = Math.floor(Math.random()*(max-min+1))+min;
let attempts = 0;
let currentScore = 0;
let gameOver = false;
let low = min;
let high = max;

let highScore = localStorage.getItem('highScore');
highScoreDisplay.textContent=highScore!==null?highScore:'--';


// for user's guess input
function guess(){
  if(gameOver) return;
  const userGuess = parseInt(guessInput.value,10);
  
  // Error handling
  if(isNaN(userGuess)||userGuess<low||userGuess>high){
    feedback.textContent=`Please enter a valid no. between ${low} and ${high}!`;
    return;
  }
  
  // increment attempt and uptdate the display
  
  attempts++;
  attemptsDisplay.textContent=attempts;
  
  if(userGuess<randomNumber){
    feedback.textContent=`Too low! Try again.`;
    low = Math.max(low,userGuess+1);
  }else if(userGuess>randomNumber){
    feedback.textContent=`Too high! Try again.`;
    high = Math.min(high,userGuess-1);
  }else {
    feedback.textContent='';
    victoryMsg.textContent=`Congratulations! You guessed the number in ${attempts} attempts.`
    
    
    victorySound.play();
    
    currentScore = Math.max(0,100-attempts);
    currentScoreDisplay.textContent=currentScore;
    // Calculate score (higher for less attempts)
    
    if(highScore===null||currentScore>parseInt(highScore,10)){
      highScore=currentScore;
      localStorage.setItem('highScore',highScore);
      highScoreDisplay.textContent=highScore;
    }
    gameOver=true;
  }
  
  guessInput.value='';
}

function reset(){
  randomNumber=Math.floor(Math.random()*(max-min+1))+min;
  attempts=0;
  currentScore=0;
  gameOver=false;
  low=min;
  high=max;
  
  // reset displays
  
  attemptsDisplay.textContent=attempts;
  currentScoreDisplay.textContent='--';
  feedback.textContent='Make your first guess!';
  victoryMsg.textContent='';
  guessInput.value='';
  victorySound.pause();
  
 // victorySound.currentTime=0;
}

resetHighScoreBtn.addEventListener('click',()=>{
  localStorage.removeItem('highScore');
  highScore = null;
  highScoreDisplay.textContent='--';
});


submitBtn.addEventListener('click',guess);
resetBtn.addEventListener('click',reset);
guessInput.addEventListener('keydown',(e)=>{
  if(e.key==='Enter')guess();
});

const victorySound = new Audio('victory.mp3');
  