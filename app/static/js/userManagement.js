/**
 * userManagement.js
 * This file contains functions for managing user accounts,
 * including creating new accounts, updating user roles, and deleting users.
 */

// Renders the page for managing user accounts
export function renderManageAccountsPage() {
    fetch('/api/users')
    .then(response => response.json())
    .then(users => {
        const app = document.getElementById('app');
        app.innerHTML = `
        ${renderNavBar()}   
            <h1>Manage Accounts</h1>
            <table>
                <tr>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
                ${users.map(user => `
                    <tr>
                        <td>${user.username}</td>
                        <td>
                            <select onchange="updateUserRole(${user.id}, this.value)">
                                <option value="user" ${user.role === 'user' ? 'selected' : ''}>User</option>
                                <option value="prodeng" ${user.role === 'prodeng' ? 'selected' : ''}>Product Engineer</option>
                                <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                            </select>
                        </td>
                        <td>
                            ${user.role !== 'admin' ? `<button onclick="deleteUser(${user.id})">Delete</button>` : 'Cannot delete admin'}
                        </td>
                    </tr>
                `).join('')}
            </table>
        `;
    });
}

// Renders the page for creating a new account
export function renderCreateAccountPage() {
    const app = document.getElementById('app');
    app.innerHTML = `
        ${renderNavBar()}
        <h1>Create New Account</h1>
        <form id="createAccountForm">
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" required><br><br>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required><br><br>
            <label for="role">Role:</label>
            <select id="role" name="role">
                <option value="user">User</option>
                <option value="prodeng">Product Engineer</option>
                <option value="admin">Admin</option>
            </select><br><br>
            <p>Note: Non-admin users will be required to change their password every 90 days.</p>
            <button type="submit">Create Account</button>
        </form>
    `;
    document.getElementById('createAccountForm').addEventListener('submit', (e) => {
        e.preventDefault();
        createAccount(e.target);
    });
}

// Creates a new user account
export function createAccount(form) {
    const formData = new FormData(form);
    fetch('/api/create_account', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(formData)),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            renderManageAccountsPage();
        } else {
            alert(data.message);
        }
    });
}

// Updates the role of a user
export function updateUserRole(userId, newRole) {
    fetch('/api/update_user_role', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, new_role: newRole }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            renderManageAccountsPage();
        } else {
            alert(data.message);
        }
    });
}

// Deletes a user account
export function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        fetch('/api/delete_user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: userId }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                renderManageAccountsPage();
            } else {
                alert(data.message);
            }
        });
    }
}


