/**
 * navigation.js
 * This file contains functions for rendering the navigation bar
 * and handling navigation between different pages of the application.
 */

// Renders the navigation bar
export function renderNavBar() {
    return `
        <nav style="background-color: #f8f9fa; padding: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <span style="font-size: 1.5em; font-weight: bold;">Shoe Production Tracking</span>
                <span>User: ${currentUser.username}</span>
            </div>
            <div style="display: flex; justify-content: flex-start; align-items: center;">
                <button onclick="renderShoeEntryPage()">Enter Shoe Data</button>
                <button onclick="renderViewDataPage()">View Shoe Data</button>
                ${(currentUser.role === 'admin' || currentUser.role === 'prodeng') ? `
                    <button onclick="renderShoeModelEntryPage()">Create Shoe Model</button>
                    <button onclick="renderViewShoeModelsPage()">View Shoe Models</button>
                    <button onclick="renderCreateGraphsPage()">Create Graphs</button>
                ` : ''}
                ${currentUser.role === 'admin' ? `
                    <button onclick="renderCreateAccountPage()">Create New Account</button>
                    <button onclick="renderManageAccountsPage()">Manage Accounts</button>
                    <button onclick="renderBackupPage()">Backup Database</button>
                ` : ''}
                <button onclick="logout()">Logout</button>
            </div>
        </nav>
    `;
}

// Renders the main page after successful login
export function renderMainPage() {
    const app = document.getElementById('app');
    app.innerHTML = `
        ${renderNavBar()}
    `;
}