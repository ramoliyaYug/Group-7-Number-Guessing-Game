# Number Guessing Game:

## Overview
This project integrates a **Login and Signup System** with a **Number Guessing Game**. The application allows users to register, log in, and play an engaging game where they guess a randomly generated number. The game features a leaderboard to track high scores and includes a timer for added challenge.

---

## Features
1. **Authentication System**:
   - User Signup and Login functionality.
   - Forgot password feature with validation.
2. **Number Guessing Game**:
   - Random number generation between a defined range.
   - Scoring system based on time left and attempts.
   - High score tracking and leaderboard.
3. **User Experience**:
   - Interactive and responsive design.
   - Pop-ups for feedback and messages.
   - Reset and logout functionality.
4. **Data Persistence**:
   - LocalStorage used to persist user data and scores.

---

## Technologies Used
- **Frontend**: HTML5, CSS3, JavaScript
- **Local Storage**: To store user credentials, high scores, and game state.

---

## How to Use

### Prerequisites
- A web browser with JavaScript enabled.

### Steps
1. Clone or download the repository.
2. Open the `index.html` file in your browser.

---

## Detailed Description

### Authentication System
- **Signup**: Users provide their name, email, and password. Data is stored securely in LocalStorage.
- **Login**: Validates credentials against stored data.
- **Forgot Password**: Users can reset their password if they forget it.

### Game Mechanics
- A random number is generated between 1 and 100.
- Players have 60 seconds to guess the number.
- Feedback is provided for each guess:
  - "Too high" or "Too low."
- Final score is calculated based on:
  - Remaining time.
  - Number of attempts.

### Leaderboard
- Displays top scores with usernames.
- Automatically updates when new scores are added.