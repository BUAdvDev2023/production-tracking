/**
 * controlPanel.js
 * This file contains functions for managing the admin control panel,
 * including rendering the control panel and backup page, performing
 * manual backups, and handling backup confirmations.
 */

// Renders the control panel
export function renderControlPanel() {
    const app = document.getElementById('app');
    app.innerHTML = `
        ${renderNavBar()}
        <h1>Admin Control Panel</h1>
        <button onclick="performManualBackup()">Perform Manual Backup</button>
        <div id="backupStatus"></div>
    `;
}

// Renders the backup page
export function renderBackupPage() {
    const app = document.getElementById('app');
    app.innerHTML = `
        ${renderNavBar()}
        <h1>Database Backup</h1>
        <button onclick="performManualBackup()">Perform Manual Backup</button>
        <div id="backupStatus"></div>
        <button onclick="renderMainPage()">Back to Main Page</button>
    `;
}

// Performs a manual backup
export function performManualBackup() {
    fetch('/api/manual_backup', {
        method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('backupStatus').innerHTML = `<p style="color: green;">${data.message}</p>`;
        } else if (data.existing_files) {
            const confirmMessage = `The following backup files already exist:\n${data.existing_files.join('\n')}\n\nDo you want to overwrite them?`;
            if (confirm(confirmMessage)) {
                confirmBackupOverwrite();
            } else {
                document.getElementById('backupStatus').innerHTML = `<p style="color: blue;">Backup cancelled.</p>`;
            }
        } else {
            document.getElementById('backupStatus').innerHTML = `<p style="color: red;">${data.message}</p>`;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('backupStatus').innerHTML = '<p style="color: red;">An error occurred while performing the backup.</p>';
    });
}

// Confirms the backup overwrite
function confirmBackupOverwrite() {
    fetch('/api/confirm_backup_overwrite', {
        method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('backupStatus').innerHTML = `<p style="color: green;">${data.message}</p>`;
        } else {
            document.getElementById('backupStatus').innerHTML = `<p style="color: red;">${data.message}</p>`;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('backupStatus').innerHTML = '<p style="color: red;">An error occurred while performing the backup.</p>';
    });
}