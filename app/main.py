import os
import sqlite3
from flask import Flask, render_template, request, redirect, url_for, flash

DB_PATH = os.getenv('DB_PATH', 'database/shoe_database.db')  # Default to the original path for local development

app = Flask(__name__, template_folder='templates')
app.secret_key = 'your_secret_key'  # needed for flashing messages

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
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
        return redirect(url_for('index'))
    return render_template('index.html')

@app.route('/view_data')
def view_data():
    conn = get_db_connection()
    shoes = conn.execute('SELECT * FROM shoes').fetchall()
    conn.close()
    return render_template('view_data.html', shoes=shoes)

if __name__ == '__main__':
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
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
    app.run(host='0.0.0.0', port=80)

