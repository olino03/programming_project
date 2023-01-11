import time
import bcrypt
import jwt
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mongoengine import MongoEngine

from os import environ
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

# class Restante(db.Document):
#     materii = db.ListField()

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,true')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route('/time')
def get_current_time():
    return {'time': time.time()}

# @app.route('/test')
# def writeDB():
#     Restante(materii=["mate", "logica"]).save()
#     return {'success': True}

class User(db.Document):
    fname = db.StringField()
    lname = db.StringField()
    email = db.StringField()
    phone = db.StringField()
    password = db.StringField()
    accessToken = db.StringField()

@app.route('/register', methods=["POST"])
def register():
    data = request.json


    user = User.objects(email=data['email'])
    if user:
        return {"success": False, "message": "An account with this E-Mail already exists."}

    passw = bytes(data['password'], 'UTF-8')

    encoded_jwt = jwt.encode({"email": data['email']}, secret, algorithm="HS256")
    # print(encoded_jwt)

    # salt = bcrypt.gensalt()
    hashedPass = bcrypt.hashpw(passw, bcrypt.gensalt())
    # print(hashedPass)

    User(fname=data['fname'], lname=data['lname'], email=data['email'], phone=data["phone"], password=hashedPass, accessToken=encoded_jwt).save()
    return {"success": True, 'accessToken': encoded_jwt}

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    try:
        user = User.objects.get(email=data['email'])
    except:
        return {"success": False, "message": "This email doesn't exist."}
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