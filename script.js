// DOM Elements
const guess = document.getElementById('guess-input');
const submitBtn = document.getElementById('submit-btn');
const attemptsDisplay = document.getElementById('attempts');
const currentScore = document.getElementById('current-score');
const highScore = document.getElementById('high-score');
const resetBtn = document.getElementById('reset-btn');
const resetHighScoreBtn = document.getElementById('reset-high-score-btn');
const feedback = document.getElementById('feedback');
const victoryMsg = document.getElementById('victory-message');

// Game Variables
const min = 1;
const max = 100;

let randomNo =Math.floor(Math.random()*(max-min+1))+min; 
let attempts = 0;
let currScore = 0;
let GameOver = false;

// Fetch high score from local storage

let high_Score =localStorage.getItem('highScore'); 
if(high_Score!==null){
  highScore.textContent =high_Score;
}else{
  highScore.textContent ='--';
}

// Handle guess submission

function GuessSubmission() {
  if(GameOver)return; 

  const userGuess =parseInt(guess.value,10); 
  // Convert input to integer


  // to handle invalid inputs
if(isNaN(userGuess)||userGuess<min||userGuess>max){
    feedback.textContent ='Please enter a valid number within the range!';
    return;}
  



    // Increment attempts and update display
attempts++;
attemptsDisplay.textContent = attempts;


  // Process the guess
  if(userGuess<randomNo){
    feedback.textContent = 'Too low! Try again.';
  }else if(userGuess>randomNo){
    feedback.textContent ='Too high! Try again.';
  }else{
    feedback.textContent = ''; 
    victoryMsg.textContent =`Congratulations! You guessed the number in ${attempts} attempts.`;
    victorySound.play(); 

    // Scoring logic
    currScore =Math.max(0,100-attempts); 
    currentScore.textContent =currScore;

    // Update high score
    if(high_Score===null||currScore>parseInt(high_Score, 10)) {
      high_Score = currScore;
      localStorage.setItem('highScore', high_Score); // Save high score to local storage
      highScore.textContent = high_Score;
    }

    // End the game
    GameOver =true;
  }
  guess.value =''; 
}

// Reset the game
function resetGame() {

  victorySound.pause(); 
  victorySound.currentTime = 0; // Reset sound playback position

  randomNo =Math.floor(Math.random()*(max-min+1))+min; // Generate a new random number
  attempts =0;
  currScore =0;
  GameOver =false; // Reset game status

  // Reset displays and feedback
  attemptsDisplay.textContent =attempts;
  currentScore.textContent ='--';
  feedback.textContent ='Make your first guess!';
  victoryMsg.textContent ='';
  guess.value =''; // Clear input field

}

// Reset high score
resetHighScoreBtn.addEventListener('click',()=>{
  localStorage.removeItem('highScore'); // Remove high score from local storage
  high_Score =null; // Reset high score variable
  highScore.textContent ='--'; // Update display
});

// Submit on Enter key
guess.addEventListener('keydown',(e)=>{
  if (e.key==='Enter') {
    GuessSubmission();
  }
});

// Victory sound
const victorySound =new Audio('victory.mp3'); 
submitBtn.addEventListener('click', GuessSubmission); // Handle guess submission on button click
resetBtn.addEventListener('click', resetGame); // Handle reset game on button click
