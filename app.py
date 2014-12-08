#!/usr/bin/env python3.4

from flask import Flask, send_file, jsonify, request
import requests
import os
import json
import hashlib

app = Flask(__name__, static_url_path='', static_folder='.')

@app.route("/")
def main():
    return send_file("index.html")

CACHE_DIR = './cache'
def get_cache_path(path, query_str):
    m = hashlib.md5()
    m.update(path.encode('utf-8'))
    m.update(query_str.encode('utf-8'))

    return os.path.join(CACHE_DIR, m.hexdigest())

def store_in_cache(path, query_str, response):
    with open(get_cache_path(path, query_str), 'w') as f:
        f.write(json.dumps(response))
        print("Stored in cache.")

def retrieve_from_cache(path, query_str):
    path = get_cache_path(path, query_str)
    if os.path.isfile(path):
        print("Found in cache.")
        return json.load(open(path))

@app.route('/query/<path:path>')
def query(path):
    query_str = str(request.query_string, 'utf-8')

    request_url = "http://api.nytimes.com/{}?{}".format(path, query_str)
    print("Requesting response from '{}'".format(request_url))
    result = retrieve_from_cache(path, query_str)
    if result is None:
        result = requests.get(request_url).json()
        store_in_cache(path, query_str, result)

    return jsonify(result)

@app.route('/querygoodreads/<path:path>')
def querygoodreads(path):
    query_str = str(request.query_string, 'utf-8')

    request_url = "http://www.goodreads.com/{}?{}".format(path, query_str)
    print("Requesting response from '{}'".format(request_url))
    result = retrieve_from_cache(path, query_str)
    if result is None:
        result = requests.get(request_url).json()
        store_in_cache(path, query_str, result)

    return jsonify(result)


if __name__ == "__main__":
    if not os.path.exists(CACHE_DIR):
        os.mkdir(CACHE_DIR)

    app.run(port=8000, debug=True)
