import os
import sqlite3
from flask import Flask, render_template, request, redirect, url_for, flash
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

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        conn = get_users_db_connection()
        user = conn.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone()
        conn.close()

        if user and check_password_hash(user['password'], password):
            login_user(User(user['id'], user['username'], user['role']))
            flash('Logged in successfully.', 'success')
            return redirect(url_for('shoe_entry'))  # Changed from 'index' to 'shoe_entry'
        else:
            flash('Invalid username or password.', 'error')

    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Logged out successfully.', 'success')
    return redirect(url_for('login'))

@app.route('/', methods=['GET', 'POST'])
@login_required
def shoe_entry():  # Changed from 'index' to 'shoe_entry'
    if request.method == 'POST':
        if current_user.role not in ['admin', 'prodeng']:
            flash('You do not have permission to add shoes.', 'error')
            return redirect(url_for('shoe_entry'))  # Changed from 'index' to 'shoe_entry'

        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO shoes (model_name, serial_number, batch_number, shoe_type, size, brand)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                request.form['model_name'],
                request.form['serial_number'],
                request.form['batch_number'],
                request.form['shoe_type'],
                request.form['size'],
                request.form['brand']
            ))
            conn.commit()
            conn.close()
            flash('Data sent to database successfully!', 'success')
        except sqlite3.Error as e:
            flash(f'An error occurred: {e}', 'error')
        return redirect(url_for('shoe_entry'))  # Changed from 'index' to 'shoe_entry'
    return render_template('shoe_entry.html')  # Changed from 'index.html' to 'shoe_entry.html'

@app.route('/view_data')
@login_required
def view_data():
    conn = get_db_connection()
    shoes = conn.execute('SELECT * FROM shoes').fetchall()
    conn.close()
    return render_template('view_data.html', shoes=shoes)

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