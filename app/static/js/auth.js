/**
 * auth.js
 * This file contains functions related to user authentication,
 * including login, logout, and rendering the login page.
 */

//Handles user login
export function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.currentUser = data.user;
            window.renderMainPage();
        } else if (data.reset_required) {
            alert(data.message);
            renderPasswordResetPage();
        } else {
            alert(data.message);
        }
    });
}

// Logs out the current user
export function logout() {
    fetch('/api/logout')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.currentUser = null;
            window.renderLoginPage();
        } else {
            alert(data.message);
        }
    });
}

// Renders login page
export function renderLoginPage() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <h1>Login</h1>
        <form id="loginForm">
            <label for="username">Username:</label>
            <input type="text" id="username" required><br><br>
            <label for="password">Password:</label>
            <input type="password" id="password" required><br><br>
            <button type="submit">Login</button>
        </form>
    `;
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        login();
    });
}

// Renders password reset page
export function renderPasswordResetPage() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <h1>Reset Password</h1>
        <form id="passwordResetForm">
            <label for="username">Username:</label>
            <input type="text" id="username" required><br><br>
            <label for="currentPassword">Current Password:</label>
            <input type="password" id="currentPassword" required><br><br>
            <label for="newPassword">New Password:</label>
            <input type="password" id="newPassword" required><br><br>
            <label for="confirmPassword">Confirm New Password:</label>
            <input type="password" id="confirmPassword" required><br><br>
            <button type="submit">Reset Password</button>
        </form>
        <button onclick="renderLoginPage()">Back to Login</button>
    `;
    document.getElementById('passwordResetForm').addEventListener('submit', (e) => {
        e.preventDefault();
        resetPassword();
    });
}

// Resets the user's password
export function resetPassword() {
    const username = document.getElementById('username').value;
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        alert("New passwords don't match!");
        return;
    }

    if (newPassword === currentPassword) {
        alert("New password must be different from the current password!");
        return;
    }

    fetch('/api/reset_password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, currentPassword, newPassword }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            renderLoginPage();
        } else {
            alert(data.message);
        }
    });
}