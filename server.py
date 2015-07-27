#!/usr/bin/env python

from app import app
from flask.ext.compress import Compress

app.run(host='0.0.0.0', debug=False, port=8080)
Compress(app)
