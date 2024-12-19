// DOM Elements
const guessInput = document.getElementById('guess-input'); // Input field for user's guess
const submitBtn = document.getElementById('submit-btn'); // Button to submit the guess
const attemptsDisplay = document.getElementById('attempts'); // Display for number of attempts
const currentScoreDisplay = document.getElementById('current-score'); // Display for current score
const highScoreDisplay = document.getElementById('high-score'); // Display for high score
const resetBtn = document.getElementById('reset-btn'); // Button to reset the game
const resetHighScoreBtn = document.getElementById('reset-high-score-btn'); // Button to reset high score
const feedback = document.getElementById('feedback'); // Area to display feedback on guesses
const victoryMsg = document.getElementById('victory-message'); // Area to display victory message
const playBtn = document.getElementById('play-btn'); // Button to start the game
const timerDisplay = document.getElementById('timer'); // Display for the timer
const timeLeftDisplay = document.getElementById('time-left'); // Display for remaining time
const popup = document.getElementById('popup'); // Popup for status messages
const popupStatus = document.getElementById('pop-up-status'); // Status text in popup
const popupMessage = document.getElementById('pop-up-message'); // Message text in popup

// Section Containers
const loginContainer = document.getElementById('login-container'); // Container for the login form
const signupContainer = document.getElementById('signup-container'); // Container for the signup form
const forgotPasswordContainer = document.getElementById('forgot-password-popup'); // Container for the forgot password form
const gameContainer = document.getElementById('game-container'); // Container for the game interface

// Game Variables
const min = 1; // Minimum number for the random number game
const max = 100; // Maximum number for the random number game
let randomNumber; // The randomly generated number to guess
let attempts; // Number of attempts made by the user
let currentScore; // The score based on the game performance
let gameOver = true; // Flag to check if the game is over
let low; // The current lowest possible guess
let high; // The current highest possible guess
let timer; // Timer variable
let timeLeft = 60; // Time left in the game (60 seconds)
let currentUser = null; // Tracks the logged-in user's email
let highScore = null; // Stores the high score for the current user
const victorySound = new Audio('victory.mp3'); // Sound played when the user wins

// Generate and Store Random Number in Current User's Object
function generateAndStoreRandomNumber() {
  randomNumber = Math.floor(Math.random() * (max - min + 1)) + min; // Generate random number between min and max

  if (currentUser) {
    const user = JSON.parse(localStorage.getItem(currentUser)); // Retrieve the current user's data from localStorage
    user.randomNumber = randomNumber; // Store the generated random number in the user's data
    localStorage.setItem(currentUser, JSON.stringify(user)); // Save the updated user data back to localStorage
  }
}

// Event Listeners
playBtn.addEventListener('click', startGame); // Start game when play button is clicked
resetBtn.addEventListener('click', reset); // Reset game when reset button is clicked
resetHighScoreBtn.addEventListener('click', resetHighScore); // Reset high score when reset high score button is clicked
submitBtn.addEventListener('click', guess); // Make a guess when the submit button is clicked
guessInput.addEventListener('keydown', (e) => { // Handle Enter key for submitting the guess
  if (e.key === 'Enter') guess();
});

// Display Popup
function displayPopup(status, message) {
  popupStatus.textContent = status; // Set the status in the popup
  popupMessage.textContent = message; // Set the message in the popup
  popup.style.display = 'flex'; // Show the popup
}

// Close Popup
function closePopUp() {
  popup.style.display = 'none'; // Hide the popup
}

// Update Timer Display
function updateTime() {
  timeLeftDisplay.textContent = timeLeft; // Display the remaining time
}

// Start Game
function startGame() {
  playBtn.style.display = 'none'; // Hide the play button
  timerDisplay.style.display = 'block'; // Show the timer
  reset(); // Reset the game to its initial state
  gameOver = false; // The game is no longer over
  guessInput.disabled = false; // Enable the input field when the game starts
  startTimer(); // Start the countdown timer
}

// Start Timer
function startTimer() {
  timeLeft = 60; // Reset the time to 60 seconds
  updateTime(); // Update the timer display
  timer = setInterval(() => { // Set an interval to count down the time
    timeLeft--; // Decrease timeLeft by 1 every second
    updateTime(); // Update the timer display
    if (timeLeft <= 0) { // If time runs out, end the game
      clearInterval(timer); // Stop the timer
      endGame(false); // End the game with no win
    }
  }, 1000);
}

// End Game
function endGame(won) {
  gameOver = true; // Set gameOver to true when the game ends
  clearInterval(timer); // Stop the timer
  guessInput.disabled = true; // Disable the guess input when the game ends
  submitBtn.disabled = true; // Disable the submit button when the game ends

  if (won) { // If the player won
    feedback.textContent = ''; // Clear any feedback text
    victoryMsg.textContent = `Congratulations! You guessed the number in ${attempts} attempts.`; // Display victory message
    victorySound.play(); // Play victory sound
    updateHighScore(); // Update the high score if needed
  } else { // If the player lost
    feedback.textContent = 'Time is up! Game Over!'; // Display time up message
    victoryMsg.textContent = `The correct number was ${randomNumber}.`; // Show the correct number
  }

  playBtn.style.display = 'block'; // Show the play button again
}

// Reset Game
function reset() {
  clearInterval(timer); // Clear any running timer

  generateAndStoreRandomNumber(); // Generate a new random number for the user
  
  attempts = 0; // Reset the number of attempts
  currentScore = 0; // Reset the current score
  low = min; // Reset the lower bound of guesses
  high = max; // Reset the upper bound of guesses
  gameOver = false; // The game is no longer over

  attemptsDisplay.textContent = attempts; // Update the attempts display
  currentScoreDisplay.textContent = '--'; // Clear the current score display
  feedback.textContent = ''; // Clear any feedback
  victoryMsg.textContent = ''; // Clear the victory message
  guessInput.value = ''; // Clear the input field
  guessInput.disabled = true; // Disable the input field
  submitBtn.disabled = false; // Enable the submit button

  timeLeft = 60; // Reset the time left
  updateTime(); // Update the timer display

  victorySound.pause(); // Pause any victory sound
  victorySound.currentTime = 0; // Reset the sound playback time
}

// Guess Logic
function guess() {
  if (gameOver) return; // Do nothing if the game is over

  const userGuess = parseInt(guessInput.value, 10); // Convert the user's guess to an integer

  if (isNaN(userGuess) || userGuess < low || userGuess > high) { // Validate the guess
    feedback.textContent = `Please enter a valid number between ${low} and ${high}!`;
    return;
  }

  attempts++; // Increment the attempts counter
  attemptsDisplay.textContent = attempts; // Update the attempts display

  if (userGuess < randomNumber) { // If the guess is too low
    low = Math.max(low, userGuess + 1); // Adjust the low boundary
    feedback.textContent = `Too low! Enter a number between ${low} and ${high}.`;
  } else if (userGuess > randomNumber) { // If the guess is too high
    high = Math.min(high, userGuess - 1); // Adjust the high boundary
    feedback.textContent = `Too high! Enter a number between ${low} and ${high}.`;
  } else { // If the guess is correct
    // Calculate score based on attempts and time left
    let attemptsScore = Math.max(0, 50 - attempts * 2); // Max of 50 points for attempts
    let timeScore = Math.max(0, Math.floor((timeLeft / 60) * 50)); // Max of 50 points for time left

    // Total score is the sum of both components (bounded at 100 max)
    currentScore = Math.min(100, attemptsScore + timeScore);

    currentScoreDisplay.textContent = currentScore; // Display the score
    endGame(true); // End the game with a win
  }

  guessInput.value = ''; // Clear the input field
}

// Update High Score
function updateHighScore() {
  if (highScore === null || currentScore > highScore) { // If the current score is higher than the high score
    highScore = currentScore;

    if (currentUser) { // Update high score for the logged-in user
      const user = JSON.parse(localStorage.getItem(currentUser));
      user.highScore = highScore; // Update the user's high score
      localStorage.setItem(currentUser, JSON.stringify(user)); // Save the updated user data
    }

    highScoreDisplay.textContent = highScore; // Display the updated high score
  }
}

// Reset High Score
function resetHighScore() {
  if (currentUser) {
    const user = JSON.parse(localStorage.getItem(currentUser));
    user.highScore = null; // Reset the high score
    localStorage.setItem(currentUser, JSON.stringify(user)); // Save the updated user data

    highScore = null; // Clear the high score
    highScoreDisplay.textContent = '--'; // Clear the high score display
  }
}

// Signup
function signup(event) {
  event.preventDefault(); // Prevent form submission
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  if (localStorage.getItem(email)) { // Check if the user already exists
    displayPopup('Error', 'User already exists!');
    return;
  }

  localStorage.setItem(
    email,
    JSON.stringify({ name, password, highScore: null, randomNumber: null }) // Store the new user data
  );
  displayPopup('Success', 'Signup successful!');
  switchToLogin(); // Switch to login screen after successful signup
}

// Login
function login(event) {
  event.preventDefault(); // Prevent form submission
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const user = JSON.parse(localStorage.getItem(email)); // Retrieve the user data from localStorage

  if (!user || user.password !== password) { // Validate the credentials
    displayPopup('Error', 'Invalid credentials!');
    return;
  }

  currentUser = email; // Set the logged-in user
  highScore = user.highScore !== null ? user.highScore : null; // Retrieve the user's high score

  // Retrieve or generate the random number
  if (user.randomNumber) {
    randomNumber = user.randomNumber;
  } else {
    generateAndStoreRandomNumber(); // Generate and store a random number if none exists
  }

  highScoreDisplay.textContent = highScore !== null ? highScore : '--'; // Display the high score
  displayPopup('Success', 'Login successful!');
  loginContainer.style.display = 'none'; // Hide the login container
  gameContainer.style.display = 'block'; // Show the game container
}

// Forgot Password
function resetPassword(event) {
  event.preventDefault(); // Prevent form submission
  const email = document.getElementById('forgot-email').value;
  const newPassword = document.getElementById('new-password').value;
  const confirmPassword = document.getElementById('confirm-new-password').value;

  if (newPassword !== confirmPassword) { // Validate password confirmation
    displayPopup('Error', 'Passwords do not match!');
    return;
  }

  const user = JSON.parse(localStorage.getItem(email)); // Retrieve the user data from localStorage
  if (!user) { // If the user is not found
    displayPopup('Error', 'User not found!');
    return;
  }

  user.password = newPassword; // Update the password
  localStorage.setItem(email, JSON.stringify(user)); // Save the updated user data
  displayPopup('Success', 'Password reset successful!');
  closeForgotPasswordPopUp(); // Close the forgot password popup
}

// Switch to Signup Form
function switchToSignup() {
  document.getElementById('login-container').style.display = 'none'; // Hide login form
  document.getElementById('signup-container').style.display = 'block'; // Show signup form
  document.getElementById('forgot-password-popup').style.display = 'none'; // Hide forgot password form
}

// Switch to Login Form
function switchToLogin() {
  document.getElementById('signup-container').style.display = 'none'; // Hide signup form
  document.getElementById('forgot-password-popup').style.display = 'none'; // Hide forgot password form
  document.getElementById('login-container').style.display = 'block'; // Show login form
}

// Switch to Forgot Password Form
function switchToForgotPassword() {
  document.getElementById('login-container').style.display = 'none'; // Hide login form
  document.getElementById('signup-container').style.display = 'none'; // Hide signup form
  document.getElementById('forgot-password-popup').style.display = 'block'; // Show forgot password form
}

// Close Forgot Password Pop-Up
function closeForgotPasswordPopUp() {
  document.getElementById('forgot-password-popup').style.display = 'none'; // Hide forgot password form
  document.getElementById('login-container').style.display = 'block'; // Show login form
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

// Leaderboard Toggle Function
function toggleLeaderboard() {
  const leaderboard = document.getElementById('leaderboard');
  const gameContainer = document.getElementById('game-container');

  if (leaderboard.style.display === 'none') { // If leaderboard is hidden, show it
    populateLeaderboard();
    leaderboard.style.display = 'block'; // Show leaderboard
    gameContainer.style.display = 'none'; // Hide game container
  } else { // If leaderboard is visible, hide it
    leaderboard.style.display = 'none'; // Hide leaderboard
    gameContainer.style.display = 'block'; // Show game container
  }
}

// Populate Leaderboard Function
function populateLeaderboard() {
  const leaderboard = document.getElementById('leaderboard');
  leaderboard.querySelector('ul').innerHTML = ''; // Clear previous leaderboard content

  const scores = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const user = JSON.parse(localStorage.getItem(key));

    if (user.highScore !== null && user.name) { // Collect scores for users with high scores
      scores.push({ name: user.name, highScore: user.highScore });
    }
  }

  // Sort by high score descending
  scores.sort((a, b) => b.highScore - a.highScore);

  // Populate the leaderboard
  const list = leaderboard.querySelector('ul');
  scores.forEach((user, index) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `<span>${index + 1}. ${user.name}</span> <span>${user.highScore}</span>`;
    list.appendChild(listItem);
  });

  // Show a message if no scores are found
  if (scores.length === 0) {
    const noScoresMsg = document.createElement('p');
    noScoresMsg.style.textAlign = 'center';
    leaderboard.appendChild(noScoresMsg);
  }
}