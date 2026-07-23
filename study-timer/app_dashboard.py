import os
from flask import Flask, send_file

app = Flask(__name__)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

@app.route('/')
def dashboard():
    return send_file(os.path.join(BASE_DIR, 'study-timer-dashboard.html'))

if __name__ == '__main__':
    app.run(debug=True, port=5001)
