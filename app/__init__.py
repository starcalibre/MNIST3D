from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy

app = Flask(__name__, static_url_path='/static')
app.config.from_pyfile('config.py')
db = SQLAlchemy(app)

from app import routes, models
