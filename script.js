// Variables for Current User and Random Number
let randomNumber;
let attempts = 0;
let currentUser = null;

// Functions to Switch Between Forms
function switchToSignup() {
  document.getElementById("login-container").style.display = "none";
  document.getElementById("signup-container").style.display = "block";
}

function switchToLogin() {
  document.getElementById("signup-container").style.display = "none";
  document.getElementById("login-container").style.display = "block";
}

function switchToForgotPassword() {
  document.getElementById("login-container").style.display = "none";
  document.getElementById("forgot-password-popup").style.display = "block";
}

function closeForgotPasswordPopUp() {
  document.getElementById("forgot-password-popup").style.display = "none";
  document.getElementById("login-container").style.display = "block";
}

// Popup Functionality
function displayPopup(status, message) {
  document.getElementById("pop-up-status").textContent = status;
  document.getElementById("pop-up-message").textContent = message;
  document.getElementById("popup").style.display = "flex";
}

function closePopUp() {
  document.getElementById("popup").style.display = "none";
}

// Signup Function
function signup(event) {
  event.preventDefault();
  const name = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  if (localStorage.getItem(email)) {
    displayPopup("Error", "User already exists!");
    return;
  }

  localStorage.setItem(email, JSON.stringify({ name, password, highScore: null }));
  displayPopup("Success", "Signup successful!");
  switchToLogin();
}

// Login Function
function login(event) {
  event.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const user = JSON.parse(localStorage.getItem(email));
  if (user && user.password === password) {
    currentUser = email;
    startGame(user.highScore || "--");
    document.getElementById("login-container").style.display = "none";
  } else {
    displayPopup("Error", "Invalid credentials!");
  }
}

// Forgot Password
function resetPassword(event) {
  event.preventDefault();
  const email = document.getElementById("forgot-email").value;
  const newPassword = document.getElementById("new-password").value;
  const confirmPassword = document.getElementById("confirm-new-password").value;

  if (newPassword !== confirmPassword) {
    displayPopup("Error", "Passwords do not match!");
    return;
  }

  const user = JSON.parse(localStorage.getItem(email));
  if (!user) {
    displayPopup("Error", "User not found!");
    return;
  }

  user.password = newPassword;
  localStorage.setItem(email, JSON.stringify(user));
  displayPopup("Success", "Password reset successful!");
  closeForgotPasswordPopUp();
}

// Game Functions
function startGame(highScore) {
  document.getElementById("game-container").style.display = "block";
  document.getElementById("high-score").textContent = highScore;
  resetGame();
}

function resetGame() {
  randomNumber = Math.floor(Math.random() * 100) + 1;
  attempts = 0;
  document.getElementById("attempts").textContent = attempts;
  document.getElementById("feedback").textContent = "Make your first guess!";
}

document.getElementById("submit-btn").addEventListener("click", () => {
  const guess = parseInt(document.getElementById("guess-input").value, 10);
  if (!guess || guess < 1 || guess > 100) {
    document.getElementById("feedback").textContent = "Enter a valid number between 1 and 100!";
    return;
  }

  attempts++;
  document.getElementById("attempts").textContent = attempts;

  if (guess === randomNumber) {
    const user = JSON.parse(localStorage.getItem(currentUser));
    user.highScore = Math.max(100 - attempts, user.highScore || 0);
    localStorage.setItem(currentUser, JSON.stringify(user));
    displayPopup("Success", `You guessed it in ${attempts} attempts!`);
  } else {
    document.getElementById("feedback").textContent = guess < randomNumber ? "Too low!" : "Too high!";
  }
});

document.getElementById("reset-btn").addEventListener("click", resetGame);
