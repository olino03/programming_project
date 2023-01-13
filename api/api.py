import time
from os import environ

import bcrypt
import jwt
from flask import Flask, request
from flask_cors import CORS
from flask_mongoengine import MongoEngine

secret = environ.get('SECRET')

app = Flask(__name__)

CORS(app)

app.config['MONGODB_SETTINGS'] = {
    'db': 'programare',
    'host': 'localhost',
    'port': 27017
}

db = MongoEngine()
db.init_app(app)


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Headers',
                         'Content-Type,Authorization,true')
    response.headers.add('Access-Control-Allow-Methods',
                         'GET,PUT,POST,DELETE,OPTIONS')
    return response


@app.route('/time')
def get_current_time():
    return {'time': time.time()}

class User(db.Document):
    fname = db.StringField()
    lname = db.StringField()
    email = db.StringField()
    type = db.StringField()
    password = db.StringField()
    accessToken = db.StringField()
    tasks = db.ListField()


@app.route('/register', methods=["POST"])
def register():
    data = request.json

    user = User.objects(email=data['email'])
    if user:
        return {"success": False, "message": "An account with this e-mail already exists."}

    received_password = bytes(data['password'], 'UTF-8')

    encoded_jwt = jwt.encode(
        {"email": data['email'], "type": data['type']}, secret, algorithm="HS256")

    hashed_password = bcrypt.hashpw(received_password, bcrypt.gensalt())

    User(fname=data['fname'], lname=data['lname'], email=data['email'],
         type=data["type"], password=hashed_password, accessToken=encoded_jwt).save()
    return {"success": True, 'accessToken': encoded_jwt}


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    try:
        user = User.objects.get(email=data['email'])
    except:
        return {"success": False, "message": "This e-mail doesn't exist."}
    if bcrypt.checkpw(data['password'].encode('utf-8'), user['password'].encode('utf-8')):
        return {"success": True, "accessToken": user['accessToken']}
    else:
        return {"success": False, "message": "Wrong password."}


@app.route('/tokenLogin', methods=['POST'])
def tokenLogin():
    data = request.json
    try:
        user = jwt.decode(data['accessToken'], secret, algorithms=['HS256'])
    except:
        return {"success": False}

    if user['email'] == data['email']:
        return {"success": True, "user": user}
    else:
        return {"success": False}
