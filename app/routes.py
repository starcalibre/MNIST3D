from app import app
from flask import redirect, render_template

@app.route('/')
def index():
    return render_template('index.html')

# default 'catch all' route
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return redirect('/')
