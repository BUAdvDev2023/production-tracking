import os
import sqlite3
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash

DB_PATH = os.getenv('DB_PATH', 'database/shoe_database.db')
USERS_DB_PATH = os.getenv('USERS_DB_PATH', 'database/users.db')

app = Flask(__name__, template_folder='templates')
app.secret_key = 'your_secret_key'

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

class User(UserMixin):
    def __init__(self, id, username, role):
        self.id = id
        self.username = username
        self.role = role

@login_manager.user_loader
def load_user(user_id):
    conn = get_users_db_connection()
    user = conn.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
    conn.close()
    if user:
        return User(user['id'], user['username'], user['role'])
    return None

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def get_users_db_connection():
    conn = sqlite3.connect(USERS_DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return render_template('index.html')

@app.route('/api/login', methods=['POST'])
def api_login():
    username = request.json['username']
    password = request.json['password']
    conn = get_users_db_connection()
    user = conn.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone()
    conn.close()

    if user and check_password_hash(user['password'], password):
        login_user(User(user['id'], user['username'], user['role']))
        return jsonify({'success': True, 'user': {'username': user['username'], 'role': user['role']}})
    else:
        return jsonify({'success': False, 'message': 'Invalid username or password'}), 401

@app.route('/api/shoe_entry', methods=['POST'])
@login_required
def api_shoe_entry():
    if current_user.role not in ['admin', 'prodeng']:
        return jsonify({'success': False, 'message': 'You do not have permission to add shoes.'}), 403
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO shoes (model_name, serial_number, batch_number, shoe_type, size, brand)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            request.json['model_name'],
            request.json['serial_number'],
            request.json['batch_number'],
            request.json['shoe_type'],
            request.json['size'],
            request.json['brand']
        ))
        conn.commit()
        conn.close()
        return jsonify({'success': True, 'message': 'Data sent to database successfully!'})
    except sqlite3.Error as e:
        return jsonify({'success': False, 'message': f'An error occurred: {e}'}), 500
    
@app.route('/api/view_shoes', methods=['GET'])
@login_required
def api_view_shoes():
    conn = get_db_connection()
    shoes = conn.execute('SELECT * FROM shoes').fetchall()
    conn.close()
    return jsonify([dict(shoe) for shoe in shoes])


@app.route('/api/create_account', methods=['POST'])
@login_required
def api_create_account():
    if current_user.role != 'admin':
        return jsonify({'success': False, 'message': 'You do not have permission to create accounts.'}), 403

    username = request.json['username']
    password = request.json['password']
    role = request.json['role']

    conn = get_users_db_connection()
    try:
        hashed_password = generate_password_hash(password)
        conn.execute('INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
                     (username, hashed_password, role))
        conn.commit()
        return jsonify({'success': True, 'message': 'Account created successfully.'})
    except sqlite3.IntegrityError:
        return jsonify({'success': False, 'message': 'Username already exists.'}), 400
    finally:
        conn.close()

@app.route('/api/users', methods=['GET'])
@login_required
def api_get_users():
    if current_user.role != 'admin':
        return jsonify({'success': False, 'message': 'You do not have permission to view users.'}), 403

    conn = get_users_db_connection()
    users = conn.execute('SELECT id, username, role FROM users').fetchall()
    conn.close()
    return jsonify([dict(user) for user in users])

@app.route('/api/update_user_role', methods=['POST'])
@login_required
def api_update_user_role():
    if current_user.role != 'admin':
        return jsonify({'success': False, 'message': 'You do not have permission to update user roles.'}), 403

    user_id = request.json['user_id']
    new_role = request.json['new_role']

    conn = get_users_db_connection()
    conn.execute('UPDATE users SET role = ? WHERE id = ?', (new_role, user_id))
    conn.commit()
    conn.close()

    return jsonify({'success': True, 'message': 'User role updated successfully.'})

@app.route('/api/delete_user', methods=['POST'])
@login_required
def api_delete_user():
    if current_user.role != 'admin':
        return jsonify({'success': False, 'message': 'You do not have permission to delete users.'}), 403

    user_id = request.json['user_id']

    conn = get_users_db_connection()
    user = conn.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
    
    if user['role'] == 'admin':
        conn.close()
        return jsonify({'success': False, 'message': 'Cannot delete admin accounts.'}), 400
    
    conn.execute('DELETE FROM users WHERE id = ?', (user_id,))
    conn.commit()
    conn.close()

    return jsonify({'success': True, 'message': 'User deleted successfully.'})

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def get_users_db_connection():
    conn = sqlite3.connect(USERS_DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/api/logout', methods=['GET'])
@login_required
def api_logout():
    logout_user()
    return jsonify({'success': True, 'message': 'Logged out successfully.'})

if __name__ == '__main__':
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    os.makedirs(os.path.dirname(USERS_DB_PATH), exist_ok=True)

    # Initialize shoe database
    conn = get_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS shoes
        (id INTEGER PRIMARY KEY AUTOINCREMENT,
         model_name TEXT,
         serial_number TEXT,
         batch_number TEXT,
         shoe_type TEXT,
         size TEXT,
         brand TEXT)
    ''')
    conn.close()

    # Initialize users database
    conn = get_users_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS users
        (id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL)
    ''')

    # Check if admin user exists, if not create one
    admin = conn.execute('SELECT * FROM users WHERE username = ?', ('admin',)).fetchone()
    if not admin:
        hashed_password = generate_password_hash('shoepass')
        conn.execute('INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
                     ('admin', hashed_password, 'admin'))
    conn.commit()
    conn.close()

    app.run(host='0.0.0.0', port=80)