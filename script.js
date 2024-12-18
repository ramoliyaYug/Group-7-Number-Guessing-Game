// DOM Elements
const guessInput = document.getElementById('guess-input');
const submitBtn = document.getElementById('submit-btn');
const attemptsDisplay = document.getElementById('attempts');
const currentScoreDisplay = document.getElementById('current-score');
const highScoreDisplay = document.getElementById('high-score');
const resetBtn = document.getElementById('reset-btn');
const resetHighScoreBtn = document.getElementById('reset-high-score-btn');
const feedback = document.getElementById('feedback');
const victoryMsg = document.getElementById('victory-message');
const playBtn = document.getElementById('play-btn');
const timerDisplay = document.getElementById('timer');
const timeLeftDisplay = document.getElementById('time-left');
const popup = document.getElementById('popup');
const popupStatus = document.getElementById('pop-up-status');
const popupMessage = document.getElementById('pop-up-message');

// Section Containers
const loginContainer = document.getElementById('login-container');
const signupContainer = document.getElementById('signup-container');
const forgotPasswordContainer = document.getElementById('forgot-password-popup');
const gameContainer = document.getElementById('game-container');

// Game Variables
const min = 1;
const max = 100;
let randomNumber;
let attempts;
let currentScore;
let gameOver = true;
let low;
let high;
let timer;
let timeLeft = 60;
let currentUser = null; // Tracks the logged-in user's email
let highScore = null;
const victorySound = new Audio('victory.mp3');

// Generate and Store Random Number in Current User's Object
function generateAndStoreRandomNumber() {
  randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

  if (currentUser) {
    const user = JSON.parse(localStorage.getItem(currentUser));
    user.randomNumber = randomNumber; // Store random number in the user object
    localStorage.setItem(currentUser, JSON.stringify(user));
  }
}

// Event Listeners
playBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', reset);
resetHighScoreBtn.addEventListener('click', resetHighScore);
submitBtn.addEventListener('click', guess);
guessInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') guess();
});

// Display Popup
function displayPopup(status, message) {
  popupStatus.textContent = status;
  popupMessage.textContent = message;
  popup.style.display = 'flex';
}

// Close Popup
function closePopUp() {
  popup.style.display = 'none';
}

// Update Timer Display
function updateTime() {
  timeLeftDisplay.textContent = timeLeft;
}

// Start Game
function startGame() {
  playBtn.style.display = 'none'; // Hide the play button
  timerDisplay.style.display = 'block';
  reset();
  gameOver = false;
  guessInput.disabled = false; // Enable the input field when the game starts
  startTimer();
}

// Start Timer
function startTimer() {
  timeLeft = 60;
  updateTime();
  timer = setInterval(() => {
    timeLeft--;
    updateTime();
    if (timeLeft <= 0) {
      clearInterval(timer);
      endGame(false);
    }
  }, 1000);
}

// End Game
function endGame(won) {
  gameOver = true;
  clearInterval(timer);
  guessInput.disabled = true; // Disable the input field when the game ends
  submitBtn.disabled = true;

  if (won) {
    feedback.textContent = '';
    victoryMsg.textContent = `Congratulations! You guessed the number in ${attempts} attempts.`;
    victorySound.play();
    updateHighScore();
  } else {
    feedback.textContent = 'Time is up! Game Over!';
    victoryMsg.textContent = `The correct number was ${randomNumber}.`;
  }

  playBtn.style.display = 'block'; // Show the play button again
}

// Reset Game
function reset() {
  clearInterval(timer);

  generateAndStoreRandomNumber(); // Generate a new random number and store it in the current user's object
  
  attempts = 0;
  currentScore = 0; // Ensure currentScore resets
  low = min;
  high = max;
  gameOver = false;

  attemptsDisplay.textContent = attempts;
  currentScoreDisplay.textContent = '--'; // Clear current score display
  feedback.textContent = '';
  victoryMsg.textContent = '';
  guessInput.value = '';
  guessInput.disabled = true; // Disable the input field when the game is reset
  submitBtn.disabled = false;

  timeLeft = 60;
  updateTime();

  victorySound.pause();
  victorySound.currentTime = 0;
}

// Guess Logic
function guess() {
  if (gameOver) return;

  const userGuess = parseInt(guessInput.value, 10);

  if (isNaN(userGuess) || userGuess < low || userGuess > high) {
    feedback.textContent = `Please enter a valid number between ${low} and ${high}!`;
    return;
  }

  attempts++;
  attemptsDisplay.textContent = attempts;

  if (userGuess < randomNumber) {
    low = Math.max(low, userGuess + 1);
    feedback.textContent = `Too low! Enter a number between ${low} and ${high}.`;
  } else if (userGuess > randomNumber) {
    high = Math.min(high, userGuess - 1);
    feedback.textContent = `Too high! Enter a number between ${low} and ${high}.`;
  } else {
    // Calculate score based on attempts and time left
    // Adjust score calculation to be balanced between attempts and time left
    let attemptsScore = Math.max(0, 50 - attempts * 2); // Max of 50 points for attempts
    let timeScore = Math.max(0, Math.floor((timeLeft / 60) * 50)); // Max of 50 points for time left

    // Total score is the sum of both components (bounded at 100 max)
    currentScore = Math.min(100, attemptsScore + timeScore);

    currentScoreDisplay.textContent = currentScore; // Display score
    endGame(true);
  }

  guessInput.value = '';
}

// Update High Score
function updateHighScore() {
  if (highScore === null || currentScore > highScore) {
    highScore = currentScore;

    if (currentUser) {
      const user = JSON.parse(localStorage.getItem(currentUser));
      user.highScore = highScore; // Update high score
      localStorage.setItem(currentUser, JSON.stringify(user));
    }

    highScoreDisplay.textContent = highScore;
  }
}

// Reset High Score
function resetHighScore() {
  if (currentUser) {
    const user = JSON.parse(localStorage.getItem(currentUser));
    user.highScore = null;
    localStorage.setItem(currentUser, JSON.stringify(user));

    highScore = null;
    highScoreDisplay.textContent = '--';
  }
}

// Signup
function signup(event) {
  event.preventDefault();
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  if (localStorage.getItem(email)) {
    displayPopup('Error', 'User already exists!');
    return;
  }

  localStorage.setItem(
    email,
    JSON.stringify({ name, password, highScore: null, randomNumber: null })
  );
  displayPopup('Success', 'Signup successful!');
  switchToLogin();
}

// Login
function login(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const user = JSON.parse(localStorage.getItem(email));

  if (!user || user.password !== password) {
    displayPopup('Error', 'Invalid credentials!');
    return;
  }

  currentUser = email;
  highScore = user.highScore !== null ? user.highScore : null;

  // Retrieve the random number or generate a new one if null
  if (user.randomNumber) {
    randomNumber = user.randomNumber;
  } else {
    generateAndStoreRandomNumber();
  }

  highScoreDisplay.textContent = highScore !== null ? highScore : '--';
  displayPopup('Success', 'Login successful!');
  loginContainer.style.display = 'none';
  gameContainer.style.display = 'block';
}

// Forgot Password
function resetPassword(event) {
  event.preventDefault();
  const email = document.getElementById('forgot-email').value;
  const newPassword = document.getElementById('new-password').value;
  const confirmPassword = document.getElementById('confirm-new-password').value;

  if (newPassword !== confirmPassword) {
    displayPopup('Error', 'Passwords do not match!');
    return;
  }

  const user = JSON.parse(localStorage.getItem(email));
  if (!user) {
    displayPopup('Error', 'User not found!');
    return;
  }

  user.password = newPassword;
  localStorage.setItem(email, JSON.stringify(user));
  displayPopup('Success', 'Password reset successful!');
  closeForgotPasswordPopUp();
}

// Switch to Signup Form
function switchToSignup() {
  document.getElementById('login-container').style.display = 'none';
  document.getElementById('signup-container').style.display = 'block';
  document.getElementById('forgot-password-popup').style.display = 'none';
}

// Switch to Login Form
function switchToLogin() {
  document.getElementById('signup-container').style.display = 'none';
  document.getElementById('forgot-password-popup').style.display = 'none';
  document.getElementById('login-container').style.display = 'block';
}

// Switch to Forgot Password Form
function switchToForgotPassword() {
  document.getElementById('login-container').style.display = 'none';
  document.getElementById('signup-container').style.display = 'none';
  document.getElementById('forgot-password-popup').style.display = 'block';
}

// Close Forgot Password Pop-Up
function closeForgotPasswordPopUp() {
  document.getElementById('forgot-password-popup').style.display = 'none';
  document.getElementById('login-container').style.display = 'block';
}

// DOM Element for Logout Button
const logoutBtn = document.getElementById('logout-btn');

// Event Listener for Logout Button
logoutBtn.addEventListener('click', logout);

// Logout Function
function logout() {
  currentUser = null; // Clear the current user session
  gameContainer.style.display = 'none'; // Hide the game container
  loginContainer.style.display = 'block'; // Show the login container
  localStorage.removeItem('currentUser'); // Optionally, clear any session-based data
  displayPopup('Success', 'You have successfully logged out.');
}
