let currentUser = null;

function login() {
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
            currentUser = data.user;
            renderMainPage();
        } else {
            alert(data.message);
        }
    });
}

function renderLoginPage() {
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

function renderMainPage() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <h1>Welcome to the Shoe Database</h1>
        <p>You are logged in as ${currentUser.username}</p>
        <nav>
            <ul>
                <li><a href="#" onclick="renderShoeEntryPage()">Enter Shoe Data</a></li>
                <li><a href="#" onclick="renderViewDataPage()">View Shoe Data</a></li>
                ${currentUser.role === 'admin' ? `
                    <li><a href="#" onclick="renderCreateAccountPage()">Create New Account</a></li>
                    <li><a href="#" onclick="renderManageAccountsPage()">Manage Accounts</a></li>
                ` : ''}
                <li><a href="#" onclick="logout()">Logout</a></li>
            </ul>
        </nav>
    `;
}

function renderShoeEntryPage() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <h1>Enter Shoe Details</h1>
        <form id="shoeEntryForm">
            <input type="text" name="model_name" placeholder="Model Name" required>
            <input type="text" name="serial_number" placeholder="Serial Number" required>
            <input type="text" name="batch_number" placeholder="Batch Number" required>
            <input type="text" name="shoe_type" placeholder="Shoe Type" required>
            <input type="text" name="size" placeholder="Size" required>
            <input type="text" name="brand" placeholder="Brand" required>
            <button type="submit">Send</button>
        </form>
        <button onclick="renderMainPage()">Back to Main Page</button>
    `;
    document.getElementById('shoeEntryForm').addEventListener('submit', (e) => {
        e.preventDefault();
        submitShoeEntry(e.target);
    });
}

function submitShoeEntry(form) {
    const formData = new FormData(form);
    fetch('/api/shoe_entry', {
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
            renderMainPage();
        } else {
            alert(data.message);
        }
    });
}

function renderViewDataPage() {
    fetch('/api/view_shoes')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(shoes => {
        const app = document.getElementById('app');
        app.innerHTML = `
            <h1>Shoe Database Contents</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Model Name</th>
                        <th>Serial Number</th>
                        <th>Batch Number</th>
                        <th>Shoe Type</th>
                        <th>Size</th>
                        <th>Brand</th>
                    </tr>
                </thead>
                <tbody>
                    ${shoes.map(shoe => `
                        <tr>
                            <td>${shoe.id}</td>
                            <td>${shoe.model_name}</td>
                            <td>${shoe.serial_number}</td>
                            <td>${shoe.batch_number}</td>
                            <td>${shoe.shoe_type}</td>
                            <td>${shoe.size}</td>
                            <td>${shoe.brand}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <button onclick="renderMainPage()">Back to Main Page</button>
        `;
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

function renderCreateAccountPage() {
    const app = document.getElementById('app');
    app.innerHTML = `
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
            <button type="submit">Create Account</button>
        </form>
        <button onclick="renderMainPage()">Back to Main Page</button>
    `;
    document.getElementById('createAccountForm').addEventListener('submit', (e) => {
        e.preventDefault();
        createAccount(e.target);
    });
}

function createAccount(form) {
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

function renderManageAccountsPage() {
    fetch('/api/users')
    .then(response => response.json())
    .then(users => {
        const app = document.getElementById('app');
        app.innerHTML = `
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
            <button onclick="renderCreateAccountPage()">Create New Account</button>
            <button onclick="renderMainPage()">Back to Main Page</button>
        `;
    });
}

function updateUserRole(userId, newRole) {
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

function deleteUser(userId) {
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

function logout() {
    fetch('/api/logout')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            currentUser = null;
            renderLoginPage();
        } else {
            alert(data.message);
        }
    });
}

// Initial render
renderLoginPage();