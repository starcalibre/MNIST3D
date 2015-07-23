from app import app
from flask import redirect

@app.route('/')
def hello_world():
    return 'Hello World!'

# default 'catch all' route
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return redirect('/')
