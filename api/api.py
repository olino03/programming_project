import time
from flask import Flask
from pymongo import MongoClient

app = Flask(__name__)

client = MongoClient('localhost', 27017)

@app.route('/time')
def get_current_time():
    return {'time': time.time()}