#coding=utf8
#
#

import json
import re
import os

import requests
import flask

from flask import Flask, request, abort, jsonify, Response

app = Flask(__name__)

DATA_DIR = "./data"

from datetime import timedelta
from flask import make_response, request, current_app
from functools import update_wrapper


def crossdomain(origin=None, methods=None, headers=None,
                max_age=21600, attach_to_all=True,
                automatic_options=True):
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    if headers is not None and not isinstance(headers, basestring):
        headers = ', '.join(x.upper() for x in headers)

    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers

            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            h['Access-Control-Allow-Headers'] = 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)
    return decorator

def is_same_json(a, b):
    def ordered(obj):
        if isinstance(obj,dict):
            return sorted((k, ordered(v)) for k,v in obj.items())
        if isinstance(obj,list):
            return sorted(ordered(x) for x in obj)
        else:
            return obj

    return ordered(a) == ordered(b);

def read_csv(filename):
    def clean(item):
        return item.strip().replace("\"","")

    with open(filename) as f:
        header = f.readline()
        header_list = [clean(i) for i in header.split(",")]
        item_list = []
        for line in f.readlines():
            item = {}
            line_list = [clean(i) for i in line.split(',')]
            for i, j in zip(header_list, line_list):
                item[i]=j
            item_list.append(item)
    return item_list




@app.route('/mock', methods = ['POST',"OPTIONS"])
@crossdomain(origin='*')
def post_mock():
    if not request.json:
        abort(400)

    test_csv = os.path.join(DATA_DIR, 'test.csv')
    item_list = read_csv(test_csv)
    resp = jsonify(item_list)
    return resp

def test():
    test_csv = os.path.join(DATA_DIR, 'test.csv')
    item_list = read_csv(test_csv)
    print(item_list)


def main():
    app.run(debug = True,port = 5001)

if __name__ == '__main__':
    main()