//function to switch from login to signup
function switchToSignup() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('signup-container').style.display = 'block';
}

//function to switch from signup to login
function switchToLogin() {
    document.getElementById('signup-container').style.display = 'none';
    document.getElementById('login-container').style.display = 'block';
}

//function to register a new user
function signup(event) {
    event.preventDefault();
    const name = document.getElementById("signup-name").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    // validation for name
    if (!name) {
        displayPopup("Error", "Name is required", "red");
        return;
    }

    // validation for email
    if (!email) {
        displayPopup("Error", "Email is required", "red");
        return;
    }

    // validation for password
    if (!password) {
        displayPopup("Error", "Password is required", "red");
        return;
    }

    // check if email already exists
    if (localStorage.getItem(email)) {
        displayPopup("Error", "Email already exists", "red");
        return;
    }

    // store user details in local storage in form of JSON object
    localStorage.setItem(email, JSON.stringify({ name, password }));

    // display success message
    displayPopup("Success", "Registration successful!", "green");
}

//function to login a user
function login(event) {
    event.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    // validation for email
    if (!email) {
        displayPopup("Error", "Email is required", "red");
        return;
    }

    // validation for password
    if (!password) {
        displayPopup("Error", "Password is required", "red");
        return;
    }

    // check if user exists
    const user = JSON.parse(localStorage.getItem(email));
    if (!user) {
        displayPopup("Error", "User not found", "red");
    } else if (user.password !== password) {
        displayPopup("Error", "Incorrect password", "red");
    } else {
        displayPopup("Success", "Login successful!", "green");
    }
}

//function to retrieve password
function forgotPassword(event) {
    event.preventDefault();
    const email = document.getElementById("login-email").value;

    // validation for email
    if (!email) {
        displayPopup("Error", "Email is required to retrieve password", "red");
        return;
    }

    // check if user exists
    const user = JSON.parse(localStorage.getItem(email));
    if (!user) {
        displayPopup("Error", "User not found", "red");
    } else {
        displayPopup("Password", `Your password is: ${user.password}`, "blue");
    }
}

//function to display popup
function displayPopup(status, message, color) {
    const popup = document.getElementById("popup");
    const popupStatus = document.getElementById("pop-up-status");
    const popupMessage = document.getElementById("pop-up-message");

    popupStatus.textContent = status;
    popupStatus.style.color = color;
    popupMessage.textContent = message;

    popup.style.display = "flex";
}

//function to close popup
function closePopUp() {
    document.getElementById("popup").style.display = "none";
}

//function to switch from login to forgot password
function switchToForgotPassword() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('signup-container').style.display = 'none';
    document.getElementById('forgot-password-popup').style.display = 'flex';
}

//function to reset password
function resetPassword(event) {
    event.preventDefault();
    
    const email = document.getElementById("forgot-email").value;
    const newPassword = document.getElementById("new-password").value;
    const confirmNewPassword = document.getElementById("confirm-new-password").value;

    // validation for email
    if (!email) {
        displayPopup("Error", "Email is required", "red");
        return;
    }

    // validation for new password
    if (!newPassword) {
        displayPopup("Error", "New password is required", "red");
        return;
    }

    // validation for confirm new password
    if (!confirmNewPassword) {
        displayPopup("Error", "Please confirm your new password", "red");
        return;
    }

    // validation for password
    if (newPassword !== confirmNewPassword) {
        displayPopup("Error", "Passwords do not match", "red");
        return;
    }

    // check if user exists
    const user = JSON.parse(localStorage.getItem(email));
    if (!user) {
        displayPopup("Error", "User not found", "red");
    } else {
        user.password = newPassword;
        localStorage.setItem(email, JSON.stringify(user));
        displayPopup("Success", "Password reset successful!", "green");
        closeForgotPasswordPopUp();
    }
}

//function to close forgot password popup
function closeForgotPasswordPopUp() {
    document.getElementById('forgot-password-popup').style.display = 'none';
    document.getElementById('login-container').style.display = 'block';
}

//function to switch from forgot password to login
function forgotPassword(event) {
    event.preventDefault();
    const email = document.getElementById("login-email").value;

    if (!email) {
        displayPopup("Error", "Email is required to retrieve password", "red");
        return;
    }

    const user = JSON.parse(localStorage.getItem(email));
    if (!user) {
        displayPopup("Error", "User not found", "red");
    } else {
        switchToForgotPassword();
    }
}
