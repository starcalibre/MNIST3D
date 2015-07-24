from app import app
from app.models import Digit
from flask import redirect, render_template, request, jsonify

@app.route('/')
def index():
    return render_template('index.html')

# api route
# parameters
#
# id: id to query, will return all otherwise
# select: one value per item in the query
# limit: limit, obviously.
@app.route('/api')
def api():
    query_id = request.args.get('id')  # get first id in query string
    query_limit = request.args.get('limit')  # get first limit in query string
    query_select = request.args.getlist('select')  # get all select params

    if query_id is not None:
        result = Digit.query.\
            filter(Digit.id == query_id).\
            all()
    else:
        result = Digit.query.limit(query_limit).all()
    return jsonify(result=[r.as_dict(query_select) for r in result])

# default 'catch all' route
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return redirect('/')
