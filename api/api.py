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

class Task(db.Document):
    id = db.IntField()
    claimed = db.BooleanField()
    company = db.StringField()
    date = db.StringField()
    schedule = db.ListField()
    waypoints = db.ListField()
    geocodedWaypoints = db.ListField()
    precalculatedRoutes = db.ListField()

@app.route('/createTask', methods=["POST"])
def create_task():
    data = request.json

    Task(id=data["id"], claimed=data["claimed"], company=data['company'], date=data['date'], 
        schedule=data["schedule"], waypoints=data['waypoints'], geocodedWaypoints=data['geocodedWaypoints'],
        precalculatedRoutes=data['precalculatedRoutes']).save()
    return {"success": True}

@app.route('/deleteTask', methods=["POST"])
def delete_task():
    data = request.json

    try:
        task = Task.objects.get(id=data["id"])
    except:
        return {"success": False, "message": "This task doesn't exist."}
    else:
        task.delete()
        return {"success": True}

@app.route('/register', methods=["POST"])
def register():
    data = request.json

    user = User.objects(email=data['email'])
    if user:
        return {"success": False, "message": "An account with this e-mail already exists."}

    received_password = bytes(data['password'], 'UTF-8')

    encoded_jwt = jwt.encode(
        {"fname": data['fname'], "lname": data["lname"], "email": data['email'], "type": data['type']}, secret, algorithm="HS256")

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
        return {"success": True, "accessToken": user['accessToken'], "fname": user['fname'], "lname": user["lname"]}
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

