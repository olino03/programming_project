import json
import time
from os import environ
from route import convert_to_final, greedy_approximation, parse_into_matrix

import bcrypt
import jwt
from flask import Flask, request
from flask_cors import CORS
from flask_mongoengine import MongoEngine
import random
import sys

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
    taskid = db.IntField()
    claimed = db.BooleanField()
    company = db.StringField()
    schedule = db.ListField()
    waypoints = db.ListField()
    precalculatedRoutes = db.ListField()
    claimedBy = db.StringField()
    claimedPoint = db.ListField()

@app.route('/createTask', methods=["POST"])
def create_task():
    data = request.json
    tid = random.randint(10000,99999)
    # print(data["data"], file=sys.stderr)
    x = parse_into_matrix(data["data"])
    preRoutes = convert_to_final(greedy_approximation(x[0], 0), x[2])
    # print(type(preRoutes), file=sys.stderr)
    Task(taskid=tid, claimedPoint=[], claimed=False, claimedBy="", company=data['company'], schedule=data["schedule"], waypoints=data['waypoints'], precalculatedRoutes=preRoutes).save()
    
    try:
        user = User.objects.get(email=data['email'])
    except:
        return {"success": False, "message": "This email doesn't exist"}
    else:
        user['tasks'].append({"taskid": tid, "type": 0})
        User.update(user, tasks=user['tasks'])
        return {"success": True}

@app.route('/deleteTask', methods=["POST"])
def delete_task():
    data = request.json
    try:
        task = Task.objects.get(taskid=data["taskid"])
    except:
        return {"success": False, "message": "This task doesn't exist."}
    else:
        try:
            user = User.objects.get(email=data['email'])
        except:
            return {"success": False, "message": "This email doesn't exist"}
        else:
            user['tasks'] = [i for i in user['tasks'] if i['taskid'] != data["taskid"]]
            User.update(user, tasks=user['tasks'])
            task.delete()
            return {"success": True}

@app.route('/claimTask', methods=["POST"])
def claim_task():
    data = request.json
    try:
        user = User.objects.get(email=data['email'])
    except:
        return {"success": False, "message": "This email doesn't exist"}
    else:
        user['tasks'].append({"taskid": data['taskid'], "type": 3})
        User.update(user, tasks=user['tasks'])
        try:
            task = Task.objects.get(taskid=data['taskid'])
        except:
            return {"success": False, "message": "Couldn't fetch one of the tasks"}
        else:
            Task.update(task, claimed=True)
            Task.update(task, claimedBy=user["email"])
            Task.update(task, claimedPoint=data['waypoint'])
            return {"success": True}

@app.route('/fetchTasks', methods=["POST"])
def fetch_tasks():
    data = request.json
    try:
        user = User.objects.get(email=data['email'])
    except:
        return {"success": False, "message": "This email doesn't exist"}
    else:
        tasks = []
        taskTypes = []
        for i in user['tasks']:
            try:
                task = Task.objects.get(taskid=i['taskid'])
            except:
                return {"success": False, "message": "Couldn't fetch one of the tasks"}
            else:
                tasks.append(task)
        return {"success": True, "tasks": tasks, "taskTypes": taskTypes};

@app.route('/fetchAllTasks', methods=["POST"])
def fetch_all_tasks():
    data = request.json
    try:
        user = User.objects.get(email=data['email'])
    except:
        return {"success": False, "message": "This email doesn't exist"}
    else:
        tasks = []
        userTasks = [int(i['taskid']) for i in user['tasks']]
        for task in Task.objects:
            # print(int(task["taskid"]) in userTasks, file=sys.stderr)
            if not task.claimed and int(task["taskid"]) not in userTasks:
                tasks.append(task)
        return {"success": True, "tasks": tasks}

@app.route('/finishTask', methods=["POST"])
def finish_task():
    data = request.json
    try:
        task = Task.objects.get(taskid=data['taskid'])
    except:
        return {"success": False, "message": "Couldn't fetch one of the tasks"}
    else:
        try:
            user = User.objects.get(email=task["claimedBy"])
        except:
            return {"success": False, "message": "This email doesn't exist"}
        else:
            for i in user['tasks']:
                if i['taskid'] == data['taskid']:
                    i['type'] = 1
            User.update(user, tasks=user['tasks'])
            try:
                clientUser = User.objects.get(email=data['email'])
            except:
                return {"success": False, "message": "This email doesn't exist"}
            else:
                for i in clientUser['tasks']:
                    if int(i['taskid']) == int(data['taskid']):
                        i['type'] = 1
                # print(clientUser['tasks'], file=sys.stderr)
                User.update(clientUser, tasks=clientUser['tasks'])
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

