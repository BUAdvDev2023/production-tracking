/**
 * app.js
 * This file contains the client-side JavaScript code for the Shoe Database application.
 * It handles rendering different pages, user interactions, and API calls to the server.
 */

let currentUser = null; // Stores the current logged-in user's information
let shoeCreationChart = null; // Stores the Chart.js instance for shoe creation data

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
                ${(currentUser.role === 'admin' || currentUser.role === 'prodeng') ? `
                    <li><a href="#" onclick="renderShoeModelEntryPage()">Enter New Shoe Model</a></li>
                    <li><a href="#" onclick="renderViewShoeModelsPage()">View Shoe Models</a></li>
                ` : ''}
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
        <form id="shoeEntryForm" style="display: flex; flex-direction: column; gap: 10px;">
            <input type="text" name="model_name" placeholder="Model Name" required>
            <input type="text" name="serial_number" placeholder="Serial Number" required>
            <input type="text" name="batch_number" placeholder="Batch Number" required>
            <input type="text" name="shoe_type" placeholder="Shoe Type" required>
            <input type="text" name="size" placeholder="Size" required>
            <input type="text" name="brand" placeholder="Brand" required>
            <select name="shoe_model_id" required>
                <option value="">Select Shoe Model</option>
                <!-- This will be populated dynamically -->
            </select>
            <button type="submit">Send</button>
        </form>
        <button onclick="renderMainPage()">Back to Main Page</button>
    `;
    document.getElementById('shoeEntryForm').addEventListener('submit', (e) => {
        e.preventDefault();
        submitShoeEntry(e.target);
    });
    
    // Populate shoe model dropdown
    fetch('/api/shoe_models')
    .then(response => response.json())
    .then(models => {
        const select = document.querySelector('select[name="shoe_model_id"]');
        models.forEach(model => {
            const option = document.createElement('option');
            option.value = model.id;
            option.textContent = `${model.brand} - ${model.model_name}`;
            select.appendChild(option);
        });
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
    .then(response => response.json())
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
                        <th>Shoe Model ID</th>
                        <th>Created At</th>
                        <th>Created By</th>
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
                            <td>${shoe.shoe_model_id || 'N/A'}</td>
                            <td>${shoe.created_at || 'N/A'}</td>
                            <td>${shoe.created_by || 'N/A'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <button onclick="renderMainPage()">Back to Main Page</button>
        `;
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

function renderShoeModelEntryPage() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <h1>Enter New Shoe Model</h1>
        <form id="shoeModelEntryForm" style="display: flex; flex-direction: column; gap: 10px;">
            <input type="text" name="model_name" placeholder="Model Name" required>
            <select name="brand" required>
                <option value="">Select Brand</option>
                <option value="Nike">Nike</option>
                <option value="Adidas">Adidas</option>
                <option value="Puma">Puma</option>
                <option value="Reebok">Reebok</option>
            </select>
            <select name="category" required>
                <option value="">Select Category</option>
                <option value="Running">Running</option>
                <option value="Basketball">Basketball</option>
                <option value="Casual">Casual</option>
                <option value="Football">Football</option>
            </select>
            <select name="gender" required>
                <option value="">Select Gender</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Unisex">Unisex</option>
            </select>
            <select name="material" required>
                <option value="">Select Material</option>
                <option value="Leather">Leather</option>
                <option value="Synthetic">Synthetic</option>
                <option value="Canvas">Canvas</option>
                <option value="Knit">Knit</option>
            </select>
            <select name="sole_type" required>
                <option value="">Select Sole Type</option>
                <option value="Rubber">Rubber</option>
                <option value="EVA">EVA</option>
                <option value="PU">PU</option>
                <option value="TPU">TPU</option>
            </select>
            <select name="closure_type" required>
                <option value="">Select Closure Type</option>
                <option value="Lace-up">Lace-up</option>
                <option value="Slip-on">Slip-on</option>
                <option value="Velcro">Velcro</option>
                <option value="Buckle">Buckle</option>
            </select>
            <select name="color" required>
                <option value="">Select Color</option>
                <option value="Black">Black</option>
                <option value="White">White</option>
                <option value="Red">Red</option>
                <option value="Blue">Blue</option>
            </select>
            <input type="number" name="weight_grams" placeholder="Weight (grams)" required>
            <input type="number" name="price" placeholder="Price" step="0.01" required>
            <input type="date" name="release_date" required>
            <button type="submit">Add Shoe Model</button>
        </form>
        <button onclick="renderMainPage()">Back to Main Page</button>
    `;
    document.getElementById('shoeModelEntryForm').addEventListener('submit', (e) => {
        e.preventDefault();
        submitShoeModel(e.target);
    });
}

function submitShoeModel(form) {
    const formData = new FormData(form);
    fetch('/api/add_shoe_model', {
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

function renderViewShoeModelsPage() {
    Promise.all([
        fetch('/api/shoe_models').then(response => response.json()),
        fetch('/api/users').then(response => response.json()),
        fetch('/api/shoe_models_and_operators').then(response => response.json())
    ])
    .then(([models, users, modelsAndOperators]) => {
        const app = document.getElementById('app');
        app.innerHTML = `
            <h1>Shoe Models</h1>
            <table>
                <thead>
                    <tr>
                        <th>Model Name</th>
                        <th>Brand</th>
                        <th>Category</th>
                        <th>Gender</th>
                        <th>Material</th>
                        <th>Sole Type</th>
                        <th>Closure Type</th>
                        <th>Color</th>
                        <th>Weight (g)</th>
                        <th>Price</th>
                        <th>Release Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${models.map(model => `
                        <tr>
                            <td>${model.model_name}</td>
                            <td>${model.brand}</td>
                            <td>${model.category}</td>
                            <td>${model.gender}</td>
                            <td>${model.material}</td>
                            <td>${model.sole_type}</td>
                            <td>${model.closure_type}</td>
                            <td>${model.color}</td>
                            <td>${model.weight_grams}</td>
                            <td>${model.price}</td>
                            <td>${model.release_date}</td>
                            <td>
                                <button onclick="editShoeModel(${model.id})">Edit</button>
                                <button onclick="deleteShoeModel(${model.id})">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div style="width: 80%; margin: 20px auto;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <select id="modelSelect">
                        <option value="all">All Models</option>
                        ${modelsAndOperators.models.map(model => `<option value="${model.id}">${model.name}</option>`).join('')}
                    </select>
                    <select id="operatorSelect">
                        <option value="all">All Operators</option>
                        ${modelsAndOperators.operators.map(operator => `<option value="${operator}">${operator}</option>`).join('')}
                    </select>
                    <input type="date" id="startDate">
                    <input type="date" id="endDate">
                    <button onclick="updateShoeCreationChart()">Update Chart</button>
                </div>
                <canvas id="shoeCreationChart"></canvas>
            </div>
            <button onclick="renderMainPage()">Back to Main Page</button>
        `;
        updateShoeCreationChart();
    });
}

function updateShoeCreationChart() {
    const modelId = document.getElementById('modelSelect').value;
    const operator = document.getElementById('operatorSelect').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    const url = new URL('/api/shoe_creation_data', window.location.origin);
    url.searchParams.append('model_id', modelId);
    url.searchParams.append('operator', operator);
    if (startDate) url.searchParams.append('start_date', startDate);
    if (endDate) url.searchParams.append('end_date', endDate);

    fetch(url)
        .then(response => response.json())
        .then(data => createShoeCreationChart(data));
}

function createShoeCreationChart(data) {
    const ctx = document.getElementById('shoeCreationChart').getContext('2d');
    
    if (shoeCreationChart) {
        shoeCreationChart.destroy();
    }
    
    shoeCreationChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(item => item.date),
            datasets: [{
                label: 'Shoes Created',
                data: data.map(item => item.count),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Shoes'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Shoes Created Over Time'
                }
            }
        }
    });
}

function editShoeModel(modelId) {
    fetch(`/api/shoe_models/${modelId}`)
    .then(response => response.json())
    .then(model => {
        const app = document.getElementById('app');
        app.innerHTML = `
            <h1>Edit Shoe Model</h1>
            <form id="editShoeModelForm" style="display: flex; flex-direction: column; gap: 10px;">
                <input type="text" name="model_name" value="${model.model_name}" required>
                <select name="brand" required>
                    <option value="Nike" ${model.brand === 'Nike' ? 'selected' : ''}>Nike</option>
                    <option value="Adidas" ${model.brand === 'Adidas' ? 'selected' : ''}>Adidas</option>
                    <option value="Puma" ${model.brand === 'Puma' ? 'selected' : ''}>Puma</option>
                    <option value="Reebok" ${model.brand === 'Reebok' ? 'selected' : ''}>Reebok</option>
                </select>
                <select name="category" required>
                    <option value="Running" ${model.category === 'Running' ? 'selected' : ''}>Running</option>
                    <option value="Basketball" ${model.category === 'Basketball' ? 'selected' : ''}>Basketball</option>
                    <option value="Casual" ${model.category === 'Casual' ? 'selected' : ''}>Casual</option>
                    <option value="Football" ${model.category === 'Football' ? 'selected' : ''}>Football</option>
                </select>
                <select name="gender" required>
                    <option value="Men" ${model.gender === 'Men' ? 'selected' : ''}>Men</option>
                    <option value="Women" ${model.gender === 'Women' ? 'selected' : ''}>Women</option>
                    <option value="Unisex" ${model.gender === 'Unisex' ? 'selected' : ''}>Unisex</option>
                </select>
                <input type="text" name="material" value="${model.material}" required>
                <input type="text" name="sole_type" value="${model.sole_type}" required>
                <input type="text" name="closure_type" value="${model.closure_type}" required>
                <input type="text" name="color" value="${model.color}" required>
                <input type="number" name="weight_grams" value="${model.weight_grams}" required>
                <input type="number" name="price" value="${model.price}" step="0.01" required>
                <input type="date" name="release_date" value="${model.release_date}" required>
                <button type="submit">Update Shoe Model</button>
            </form>
            <button onclick="renderViewShoeModelsPage()">Cancel</button>
        `;
        document.getElementById('editShoeModelForm').addEventListener('submit', (e) => {
            e.preventDefault();
            updateShoeModel(modelId, e.target);
        });
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while fetching the shoe model data.' + error);
    });
}

function updateShoeModel(modelId, form) {
    const formData = new FormData(form);
    fetch(`/api/edit_shoe_model/${modelId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(formData)),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            renderViewShoeModelsPage();
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while updating the shoe model.');
    });
}

function deleteShoeModel(modelId) {
    if (confirm('Are you sure you want to delete this shoe model?')) {
        fetch(`/api/delete_shoe_model/${modelId}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                renderViewShoeModelsPage();
            } else {
                alert(data.message);
            }
        });
    }
}

// Initial render
renderLoginPage();