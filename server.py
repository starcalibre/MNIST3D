#!/usr/bin/env python

from app import app
from flask.ext.compress import Compress

app.run(debug=False, port=8080)
Compress(app)
